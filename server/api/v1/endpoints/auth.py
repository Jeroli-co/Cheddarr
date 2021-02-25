import re
from random import randrange

import requests
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Request,
    Response,
    status,
)
from fastapi.responses import RedirectResponse
from fastapi.security import OAuth2PasswordRequestForm

from server import models, schemas
from server.api import dependencies as deps
from server.core import config, security, utils
from server.core.scheduler import scheduler
from server.repositories import NotificationAgentRepository, PlexAccountRepository, UserRepository

router = APIRouter()


@router.post(
    "/sign-up",
    status_code=status.HTTP_201_CREATED,
    response_model=schemas.User,
    responses={status.HTTP_409_CONFLICT: {"description": "Email or username not available"}},
)
def signup(
    user_in: schemas.UserCreate,
    request: Request,
    user_repo: UserRepository = Depends(deps.get_repository(UserRepository)),
    notif_agent_repo: NotificationAgentRepository = Depends(
        deps.get_repository(NotificationAgentRepository)
    ),
):
    existing_email = user_repo.find_by(email=user_in.email)
    if existing_email:
        raise HTTPException(status.HTTP_409_CONFLICT, "This email is already taken.")

    existing_username = user_repo.find_by_username(user_in.username)
    if existing_username:
        raise HTTPException(status.HTTP_409_CONFLICT, "This username is already taken.")
    user = user_in.to_orm(models.User)

    # First signed-up user
    if user_repo.count() == 0:
        user.role = models.UserRole.superuser

    if config.MAIL_ENABLED:
        email_agent = notif_agent_repo.find_by(name=models.Agent.email)
        if email_agent is None or not email_agent.enabled:
            raise HTTPException(status.HTTP_400_BAD_REQUEST, "No email agent is enabled")
        email_data = schemas.EmailConfirm(email=user.email).dict()
        token = security.generate_timed_token(email_data)
        scheduler.add_job(
            utils.send_email,
            kwargs=dict(
                email_settings=email_agent.settings,
                to_email=user.email,
                subject="Welcome!",
                html_template_name="email/welcome.html",
                environment=dict(
                    username=user.username,
                    confirm_url=request.url_for("confirm_email", token=token),
                ),
            ),
        )
    else:
        user.confirmed = True
    user_repo.save(user)
    return user


@router.get(
    "/sign-up/{token}",
    responses={
        status.HTTP_403_FORBIDDEN: {"description": "Email already confirmed"},
        status.HTTP_404_NOT_FOUND: {"description": "User not found"},
        status.HTTP_410_GONE: {"description": "Invalid or expired link"},
    },
)
def confirm_email(
    token: str,
    user_repo: UserRepository = Depends(deps.get_repository(UserRepository)),
):
    try:
        email_data = schemas.EmailConfirm.parse_obj(security.confirm_timed_token(token))
    except Exception:
        raise HTTPException(
            status.HTTP_410_GONE, "The confirmation link is invalid or has expired."
        )
    if email_data.old_email is not None:
        user = user_repo.find_by_email(email_data.old_email)
        if user is None:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "No user with this email was found.")
        user.email = email_data.email
    else:
        user = user_repo.find_by_email(email_data.email)
        if user is None:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "No user with this email was found.")

        if user.confirmed:
            raise HTTPException(status.HTTP_403_FORBIDDEN, "This email is already confirmed.")
        user.confirmed = True
    user_repo.save(user)
    return {"detail": "This email is now confirmed."}


@router.patch(
    "/sign-up",
    responses={
        status.HTTP_403_FORBIDDEN: {"description": "Email already confirmed"},
        status.HTTP_404_NOT_FOUND: {"description": "User not found"},
    },
)
def resend_confirmation(
    body: schemas.EmailConfirm,
    request: Request,
    user_repo: UserRepository = Depends(deps.get_repository(UserRepository)),
    notif_agent_repo: NotificationAgentRepository = Depends(
        deps.get_repository(NotificationAgentRepository)
    ),
):
    email = body.email
    existing_user = user_repo.find_by_email(email)
    if existing_user is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No user with this email exists.")
    if existing_user.confirmed:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "This email is already confirmed.")

    email_agent = notif_agent_repo.find_by(name=models.Agent.email)
    if email_agent is None or not email_agent.enabled:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "No email agent is enabled")

    email_data = schemas.EmailConfirm(email=email).dict()
    token = security.generate_timed_token(email_data)
    scheduler.add_job(
        utils.send_email,
        kwargs=dict(
            email_settings=email_agent.settings,
            to_email=email,
            subject="Please confirm your email",
            html_template_name="email/email_confirmation.html",
            environment=dict(confirm_url=request.url_for("confirm_email", token=token)),
        ),
    )

    return {"detail": "Confirmation email sent."}


@router.post(
    "/sign-in",
    response_model=schemas.Token,
    responses={
        status.HTTP_400_BAD_REQUEST: {"description": "Email needs to be confirmed"},
        status.HTTP_401_UNAUTHORIZED: {"description": "Wrong credentials"},
    },
)
def signin(
    form: OAuth2PasswordRequestForm = Depends(),
    user_repo: UserRepository = Depends(deps.get_repository(UserRepository)),
):
    user = user_repo.find_by_username_or_email(form.username)
    if user is None or not security.verify_password(form.password, user.password):
        raise HTTPException(
            status.HTTP_401_UNAUTHORIZED,
            "Wrong username/email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.confirmed:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            "This account's email needs to be confirmed.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    payload = schemas.TokenPayload(
        sub=str(user.id),
        username=user.username,
        avatar=user.avatar,
        role=user.role,
    )
    access_token = security.create_jwt_access_token(payload)
    token = schemas.Token(
        access_token=access_token,
        token_type="Bearer",
    )
    return token


@router.get("/sign-in/plex")
def start_signin_plex():
    request_pin_url = utils.make_url(
        config.PLEX_TOKEN_URL,
        queries_dict={
            "strong": "true",
            "X-Plex-Product": "Cheddarr",
            "X-Plex-Client-Identifier": config.PLEX_CLIENT_IDENTIFIER,
        },
    )
    return request_pin_url


@router.post("/sign-in/plex/authorize")
def authorize_signin_plex(request: Request, auth_data: schemas.PlexAuthorizeSignin):
    forward_url = re.sub(
        f"{config.API_PREFIX}/v[0-9]+", "", request.url_for("confirm_signin_plex")
    )
    token = security.generate_token(
        {
            "id": auth_data.key,
            "code": auth_data.code,
            "redirectUri": auth_data.redirect_uri,
        }
    )
    authorize_url = (
        utils.make_url(
            config.PLEX_AUTHORIZE_URL,
            queries_dict={
                "context[device][product]": "Cheddarr",
                "clientID": config.PLEX_CLIENT_IDENTIFIER,
                "code": auth_data.code,
                "forwardUrl": forward_url,
            },
        )
        + "?token="
        + token
    )
    return RedirectResponse(url=authorize_url, status_code=200)


@router.get(
    "/sign-in/plex/confirm",
    response_model=schemas.Token,
    responses={
        status.HTTP_500_INTERNAL_SERVER_ERROR: {"description": "Plex authorization error"},
    },
)
def confirm_signin_plex(
    token: str,
    response: Response,
    user_repo: UserRepository = Depends(deps.get_repository(UserRepository)),
    plex_account_repo: PlexAccountRepository = Depends(deps.get_repository(PlexAccountRepository)),
):
    token = security.confirm_token(token)
    state = token.get("id")
    code = token.get("code")
    redirect_uri = token.get("redirectUri", "")
    access_url = utils.make_url(
        config.PLEX_TOKEN_URL + state,
        queries_dict={
            "code": code,
            "X-Plex-Client-Identifier": config.PLEX_CLIENT_IDENTIFIER,
        },
    )
    r = requests.get(access_url, headers={"Accept": "application/json"})
    auth_token = r.json().get("authToken")
    if auth_token is None:
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, "Error while authorizing Plex.")

    r = requests.get(
        config.PLEX_USER_RESOURCE_URL,
        headers={"X-Plex-Token": auth_token, "Accept": "application/json"},
    )
    info = r.json()
    plex_user_id = info["id"]
    plex_email = info["email"]
    plex_username = info["username"]
    plex_avatar = info["thumb"]

    # Find this plex account in the database, or create it with the corresponding user
    plex_account = plex_account_repo.find_by(plex_user_id=plex_user_id)
    if plex_account is None:
        user = user_repo.find_by_email(plex_email)
        if user is None:
            if user_repo.find_by_username(plex_username) is not None:
                plex_username = "{}{}".format(plex_username, randrange(1, 999))
            user = models.User(
                username=plex_username,
                email=plex_email,
                password=security.get_random_password(),
                avatar=plex_avatar,
                confirmed=True,
            )
            # First signed-up user
            if user_repo.count() == 0:
                user.role = models.UserRole.superuser

            user_repo.save(user)
        plex_account = models.PlexAccount(
            plex_user_id=plex_user_id, user_id=user.id, api_key=auth_token
        )
    # Update the Plex account with the API key (possibly different at each login)
    plex_account.api_key = auth_token
    plex_account_repo.save(plex_account)
    payload = schemas.TokenPayload(
        sub=str(plex_account.user.id),
        username=plex_account.user.username,
        avatar=plex_account.user.avatar,
        role=plex_account.user.role,
    )
    access_token = security.create_jwt_access_token(payload)
    token = schemas.Token(
        access_token=access_token,
        token_type="bearer",
    )
    response.headers["redirect-uri"] = redirect_uri
    return token
