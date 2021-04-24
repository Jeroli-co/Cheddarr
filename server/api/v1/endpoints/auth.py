import re
from random import randrange

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
from pydantic import EmailStr

from server.api import dependencies as deps
from server.core import config, security, utils
from server.core.http_client import HttpClient
from server.core.scheduler import scheduler
from server.models.notifications import Agent
from server.models.users import User, UserRole
from server.repositories.notifications import NotificationAgentRepository
from server.repositories.users import UserRepository
from server.schemas.auth import EmailConfirm, PlexAuthorizeSignin, Token, TokenPayload
from server.schemas.core import ResponseMessage
from server.schemas.users import UserCreate, UserSchema

router = APIRouter()


@router.post(
    "/sign-up",
    status_code=status.HTTP_201_CREATED,
    response_model=UserSchema,
    responses={status.HTTP_409_CONFLICT: {"description": "Email or username not available"}},
)
async def signup(
    user_in: UserCreate,
    request: Request,
    user_repo: UserRepository = Depends(deps.get_repository(UserRepository)),
    notif_agent_repo: NotificationAgentRepository = Depends(
        deps.get_repository(NotificationAgentRepository)
    ),
):
    existing_email = await user_repo.find_by_email(email=user_in.email)
    if existing_email:
        raise HTTPException(status.HTTP_409_CONFLICT, "This email is already taken.")

    existing_username = await user_repo.find_by_username(user_in.username)
    if existing_username:
        raise HTTPException(status.HTTP_409_CONFLICT, "This username is already taken.")
    user = user_in.to_orm(User)

    # First signed-up user
    if await user_repo.count() == 0:
        user.roles = UserRole.admin

    if config.MAIL_ENABLED:
        email_agent = await notif_agent_repo.find_by(name=Agent.email)
        if email_agent is None or not email_agent.enabled:
            raise HTTPException(status.HTTP_400_BAD_REQUEST, "No email agent is enabled")
        email_data = EmailConfirm(email=EmailStr(user.email)).dict()
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
    await user_repo.save(user)

    return user


@router.get(
    "/sign-up/{token}",
    response_model=ResponseMessage,
    responses={
        status.HTTP_403_FORBIDDEN: {"description": "Email already confirmed"},
        status.HTTP_404_NOT_FOUND: {"description": "User not found"},
        status.HTTP_410_GONE: {"description": "Invalid or expired link"},
    },
)
async def confirm_email(
    token: str,
    user_repo: UserRepository = Depends(deps.get_repository(UserRepository)),
):
    try:
        email_data = EmailConfirm.parse_obj(security.confirm_timed_token(token))
    except Exception:
        raise HTTPException(
            status.HTTP_410_GONE, "The confirmation link is invalid or has expired."
        )
    if email_data.old_email is not None:
        user = await user_repo.find_by_email(email_data.old_email)
        if user is None:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "No user with this email was found.")
        user.email = email_data.email
    else:
        user = await user_repo.find_by_email(email_data.email)
        if user is None:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "No user with this email was found.")

        if user.confirmed:
            raise HTTPException(status.HTTP_403_FORBIDDEN, "This email is already confirmed.")
        user.confirmed = True
    await user_repo.save(user)

    return {"detail": "This email is now confirmed."}


@router.patch(
    "/sign-up",
    response_model=ResponseMessage,
    responses={
        status.HTTP_403_FORBIDDEN: {"description": "Email already confirmed"},
        status.HTTP_404_NOT_FOUND: {"description": "User not found"},
    },
)
async def resend_confirmation(
    body: EmailConfirm,
    request: Request,
    user_repo: UserRepository = Depends(deps.get_repository(UserRepository)),
    notif_agent_repo: NotificationAgentRepository = Depends(
        deps.get_repository(NotificationAgentRepository)
    ),
):
    email = body.email
    existing_user = await user_repo.find_by_email(email)
    if existing_user is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No user with this email exists.")
    if existing_user.confirmed:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "This email is already confirmed.")

    email_agent = await notif_agent_repo.find_by(name=Agent.email)
    if email_agent is None or not email_agent.enabled:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "No email agent is enabled")

    email_data = EmailConfirm(email=email).dict()
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
    response_model=Token,
    responses={
        status.HTTP_400_BAD_REQUEST: {"description": "Email needs to be confirmed"},
        status.HTTP_401_UNAUTHORIZED: {"description": "Wrong credentials"},
    },
)
async def signin(
    form: OAuth2PasswordRequestForm = Depends(),
    user_repo: UserRepository = Depends(deps.get_repository(UserRepository)),
):
    user = await user_repo.find_by_username_or_email(form.username)
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
    payload = TokenPayload(
        sub=str(user.id),
        username=user.username,
        avatar=user.avatar,
        roles=user.roles,
    )
    access_token = security.create_jwt_access_token(payload)
    token = Token(
        access_token=access_token,
        token_type="Bearer",
    )

    await user_repo.save(user)
    return token


@router.get("/sign-in/plex")
async def start_signin_plex():
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
async def authorize_signin_plex(request: Request, auth_data: PlexAuthorizeSignin):
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
    response_model=Token,
    responses={
        status.HTTP_500_INTERNAL_SERVER_ERROR: {"description": "Plex authorization error"},
    },
)
async def confirm_signin_plex(
    token: str,
    response: Response,
    user_repo: UserRepository = Depends(deps.get_repository(UserRepository)),
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

    try:
        resp = await HttpClient.request("GET", access_url, headers={"Accept": "application/json"})

        auth_token = resp.get("authToken")

        resp = await HttpClient.request(
            "GET",
            config.PLEX_USER_RESOURCE_URL,
            headers={"X-Plex-Token": auth_token, "Accept": "application/json"},
        )
    except HTTPException as e:
        raise HTTPException(
            status.HTTP_500_INTERNAL_SERVER_ERROR,
            "Error while logging with Plex. Received: ",
            e.detail,
        )

    plex_user_id = resp["id"]
    plex_email = resp["email"]
    plex_username = resp["username"]
    plex_avatar = resp["thumb"]

    # Find this plex account in the database, or create it with the corresponding user
    user = await user_repo.find_by(plex_user_id=plex_user_id)
    if user is None:
        user = await user_repo.find_by_email(plex_email)
        if user is None:
            if await user_repo.find_by_username(plex_username) is not None:
                plex_username = "{}{}".format(plex_username, randrange(1, 999))
            user = User(
                username=plex_username,
                email=plex_email,
                password=security.get_random_password(),
                plex_user_id=plex_user_id,
                plex_api_key=auth_token,
                avatar=plex_avatar,
                confirmed=True,
            )
            # First signed-up user
            if await user_repo.count() == 0:
                user.roles = UserRole.admin

    # Update the Plex account with the API key (possibly different at each login)
    user.plex_user_id = plex_user_id
    user.plex_api_key = auth_token
    await user_repo.save(user)

    payload = TokenPayload(
        sub=str(user.id),
        username=user.username,
        avatar=user.avatar,
        roles=user.roles,
    )
    access_token = security.create_jwt_access_token(payload)
    token = Token(
        access_token=access_token,
        token_type="bearer",
    )
    response.headers["redirect-uri"] = redirect_uri

    return token
