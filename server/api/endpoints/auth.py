from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Request,
    Response,
    status,
    BackgroundTasks,
)
from fastapi.responses import RedirectResponse
from fastapi.security import OAuth2PasswordRequestForm
from passlib import pwd
from requests import get
from sqlalchemy.orm import Session

from server import models, schemas
from server.api import dependencies as deps
from server.core import utils
from server.core.config import settings

router = APIRouter()


@router.post(
    "/sign-up", response_model=schemas.User, status_code=status.HTTP_201_CREATED, responses={status.HTTP_409_CONFLICT:{"message": str}}
)
async def signup(
    user_in: schemas.UserCreate,
    request: Request,
    background_tasks: BackgroundTasks,
    db: Session = Depends(deps.db),
):
    existing_email = models.User.get_by_email(db, user_in.email)
    if existing_email:
        raise HTTPException(status.HTTP_409_CONFLICT, "This email is already taken.")

    existing_username = models.User.get_by_username(db, user_in.username)
    if existing_username:
        raise HTTPException(status.HTTP_409_CONFLICT, "This username is not available.")

    user = models.User.create(db, obj_in=user_in, commit=False)
    if settings.MAIL_ENABLED:
        email_data = schemas.EmailConfirm(email=user.email).dict()
        token = utils.generate_timed_token(email_data)
        background_tasks.add_task(
            utils.send_email,
            to_email=user.email,
            subject="Welcome!",
            html_template_name="email/welcome.html",
            environment=dict(
                username=user.username,
                confirm_url=request.url_for("confirm_email", token=token),
            ),
        )
    else:
        user.confirmed = True
    user.save(db)
    return user


@router.get("/sign-up/{token}")
async def confirm_email(
    token: str,
    db: Session = Depends(deps.db),
):
    try:
        email_data = schemas.EmailConfirm(**utils.confirm_timed_token(token))
    except Exception:
        raise HTTPException(
            status.HTTP_410_GONE, "The confirmation link is invalid or has expired."
        )
    if email_data.old_email is not None:
        user = models.User.get_by_email(db, email_data.old_email)
        if not user:
            raise HTTPException(
                status.HTTP_404_NOT_FOUND, "No user with this email was found."
            )
        user.update(db, obj_in=dict(email=email_data.email))
    else:
        user = models.User.get_by_email(db, email_data.email)
        if not user:
            raise HTTPException(
                status.HTTP_404_NOT_FOUND, "No user with this email was found."
            )

        if user.confirmed:
            raise HTTPException(
                status.HTTP_403_FORBIDDEN, "This email is already confirmed."
            )
        user.update(db, obj_in=dict(confirmed=True))
    return {"message": "This email is now confirmed."}


@router.patch("/sign-up")
async def resend_confirmation(
    body: schemas.EmailConfirm,
    request: Request,
    background_tasks: BackgroundTasks,
    db: Session = Depends(deps.db),
):
    email = body.email
    existing_user = models.User.get_by_email(db, email)
    if not existing_user:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND, "No user with this email exists."
        )
    if existing_user.confirmed:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST, "This email is already confirmed."
        )
    email_data = schemas.EmailConfirm(email=email).dict()
    token = utils.generate_timed_token(email_data)
    background_tasks.add_task(
        utils.send_email,
        to_email=email,
        subject="Please confirm your email",
        html_template_name="email/email_confirmation.html",
        environment=dict(confirm_url=request.url_for("confirm_email", token=token)),
    )

    return {"message": "Confirmation email sent."}


@router.post("/sign-in", response_model=schemas.Token)
async def signin(
    form: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(deps.db),
):
    user = models.User.get_by_username_or_email(db, username_or_email=form.username)
    if not user or user.password != form.password:
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
        sub=user.id,
        username=user.username,
        avatar=user.avatar,
    )
    access_token = utils.create_jwt_access_token(payload)
    token = schemas.Token(
        access_token=access_token,
        token_type="bearer",
    )
    return token


@router.get("/sign-in/plex")
async def start_signin_plex():
    request_pin_url = utils.make_url(
        settings.PLEX_TOKEN_URL,
        queries_dict={
            "strong": "true",
            "X-Plex-Product": settings.APP_NAME,
            "X-Plex-Client-Identifier": settings.PLEX_CLIENT_IDENTIFIER,
        },
    )
    return request_pin_url


@router.post("/sign-in/plex/authorize")
async def authorize_signin_plex(
    request: Request, auth_data: schemas.PlexAuthorizeSignin
):

    forward_url = request.url_for("confirm_signin_plex").replace(
        settings.API_PREFIX, ""
    )
    token = utils.generate_token(
        {
            "id": auth_data.key,
            "code": auth_data.code,
            "redirectUri": auth_data.redirect_uri,
        }
    )
    authorize_url = (
        utils.make_url(
            settings.PLEX_AUTHORIZE_URL,
            queries_dict={
                "context[device][product]": settings.APP_NAME,
                "clientID": settings.PLEX_CLIENT_IDENTIFIER,
                "code": auth_data.code,
                "forwardUrl": forward_url,
            },
        )
        + "?token="
        + token
    )
    return RedirectResponse(url=authorize_url, status_code=200)


@router.get("/sign-in/plex/confirm", response_model=schemas.Token)
async def confirm_signin_plex(
    token: str, response: Response, db: Session = Depends(deps.db)
):
    token = utils.confirm_token(token)
    state = token.get("id")
    code = token.get("code")
    redirect_uri = token.get("redirectUri", "")
    access_url = utils.make_url(
        settings.PLEX_TOKEN_URL + state,
        queries_dict={
            "code": code,
            "X-Plex-Client-Identifier": settings.PLEX_CLIENT_IDENTIFIER,
        },
    )
    r = get(access_url, headers={"Accept": "application/json"})
    auth_token = r.json().get("authToken")
    if not auth_token:
        raise HTTPException(
            status.HTTP_500_INTERNAL_SERVER_ERROR, "Error while authorizing Plex."
        )

    r = get(
        settings.PLEX_USER_RESOURCE_URL,
        headers={"X-Plex-Token": auth_token, "Accept": "application/json"},
    )
    info = r.json()
    plex_user_id = info["id"]
    email = info["email"]

    # Find this user in the database, or create it
    user = models.User.get_by_email(db, email)
    if not user:
        user_in = schemas.UserCreate(
            username=info["username"],
            email=email,
            password=pwd.genword(),
        )
        print(user_in.password)
        user = models.User.create(db, obj_in=user_in)
        user.update(db, obj_in=dict(confirmed=True, avatar=info["thumb"]))

    # Find the user's plex config in the database, or create it
    plex_config = models.PlexConfig.find_by(db, plex_user_id=plex_user_id)
    if not plex_config:
        plex_config_in = schemas.PlexConfigCreate(
            plex_user_id=plex_user_id, user_id=user.id, api_key=auth_token
        )
        plex_config = models.PlexConfig.create(db, obj_in=plex_config_in)
    # Associate the API key (possibly new at each login)
    plex_config.update(db, obj_in=dict(api_key=auth_token))

    payload = schemas.TokenPayload(
        sub=plex_config.user.id,
        username=plex_config.user.username,
        avatar=plex_config.user.avatar,
    )
    access_token = utils.create_jwt_access_token(payload)
    token = schemas.Token(
        access_token=access_token,
        token_type="bearer",
    )
    response.headers["redirect-uri"] = redirect_uri
    return token
