import re
from random import randrange
from typing import Optional

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Request,
    Response,
    status,
)
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi.security import OAuth2PasswordRequestForm

from server.api import dependencies as deps
from server.core import security, utils
from server.core.config import Config, get_config
from server.core.http_client import HttpClient
from server.core.scheduler import scheduler
from server.models.notifications import Agent
from server.models.users import Token, TokenType, User, UserRole
from server.repositories.notifications import NotificationAgentRepository
from server.repositories.users import TokenRepository, UserRepository
from server.schemas.auth import AccessToken, Invitation, PlexAuthorizeSignin, TokenPayload
from server.schemas.core import ResponseMessage
from server.schemas.users import UserCreate, UserSchema

router = APIRouter()


@router.post(
    "/sign-up",
    status_code=status.HTTP_201_CREATED,
    response_model=UserSchema,
    responses={
        status.HTTP_403_FORBIDDEN: {"description": "Sign-up disabled or invalid invitation"},
        status.HTTP_409_CONFLICT: {"description": "Email or username not available"},
    },
)
async def signup(
    user_in: UserCreate,
    invitation_code: Optional[str] = None,
    user_repo: UserRepository = Depends(deps.get_repository(UserRepository)),
    token_repo: TokenRepository = Depends(deps.get_repository(TokenRepository)),
    config: Config = Depends(get_config),
):
    if not config.signup_enabled and invitation_code is None:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "The sign-up is disabled")

    if invitation_code is not None:
        invitation = await token_repo.find_by(id=invitation_code)
        if invitation is None or (invitation.max_uses is not None and invitation.max_uses == 0):
            raise HTTPException(status.HTTP_403_FORBIDDEN, "This invitation is not valid.")
        token_payload = Invitation(**Token.time_unsign(invitation.signed_data))
        if user_in.email != token_payload.email:
            raise HTTPException(status.HTTP_403_FORBIDDEN, "Invalid user information.")

        if invitation.max_uses is not None and invitation.max_uses > 0:
            invitation.max_uses -= 1
            await token_repo.save(invitation)
            if invitation.max_uses == 0:
                await token_repo.remove_by(id=invitation_code)

    if user_in.email is not None:
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
        user.confirmed = True

    await user_repo.save(user)

    return user


@router.post(
    "/invite",
    status_code=status.HTTP_201_CREATED,
    response_model=ResponseMessage,
    responses={
        status.HTTP_400_BAD_REQUEST: {"description": "No email agent"},
        status.HTTP_409_CONFLICT: {"description": "Email already used"},
    },
    dependencies=[
        Depends(deps.get_current_user),
        Depends(deps.has_user_permissions([UserRole.manage_users])),
    ],
)
async def invite_user(
    request: Request,
    invitation: Invitation,
    user_repo: UserRepository = Depends(deps.get_repository(UserRepository)),
    token_repo: TokenRepository = Depends(deps.get_repository(TokenRepository)),
    notif_agent_repo: NotificationAgentRepository = Depends(
        deps.get_repository(NotificationAgentRepository)
    ),
):
    token = Token(
        invitation.dict(), timed=True, max_uses=invitation.max_uses, type=TokenType.invitation
    )
    await token_repo.save(token)
    invitation_link = request.url_for("check_invite_user", token=token.signed_data)

    if invitation.email is not None:
        if await user_repo.find_by_email(invitation.email) is not None:
            raise HTTPException(
                status.HTTP_409_CONFLICT, "User already registered with this email."
            )
        email_agent = await notif_agent_repo.find_by(name=Agent.email)
        if email_agent is not None and email_agent.enabled:
            scheduler.add_job(
                utils.send_email,
                kwargs=dict(
                    email_options=email_agent.settings,
                    to_email=invitation.email,
                    subject="Create your Cheddarr account",
                    html_template_name="email/invitation.html",
                    environment=dict(invitation_url=invitation_link),
                ),
            )

    return {"detail": invitation_link}


@router.get(
    "/invite/{token}",
    status_code=status.HTTP_202_ACCEPTED,
    response_model=ResponseMessage,
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "Nonexistent invitation"},
        status.HTTP_410_GONE: {"description": "Invalid or expired invitation link"},
    },
)
async def check_invite_user(
    token: str,
    token_repo: TokenRepository = Depends(deps.get_repository(TokenRepository)),
):
    try:
        data = Token.time_unsign(token)
    except Exception:
        raise HTTPException(status.HTTP_410_GONE, "The invitation link is invalid or has expired.")

    invitation = await token_repo.find_by(id=data["id"])
    if invitation is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "This invitation does not exist.")

    return {"detail": data}


@router.post(
    "/sign-in",
    response_model=AccessToken,
    responses={
        status.HTTP_400_BAD_REQUEST: {"description": "Account needs to be confirmed"},
        status.HTTP_401_UNAUTHORIZED: {"description": "Wrong credentials"},
        status.HTTP_403_FORBIDDEN: {"description": "Local accounts disabled"},
    },
)
async def signin(
    form: OAuth2PasswordRequestForm = Depends(),
    user_repo: UserRepository = Depends(deps.get_repository(UserRepository)),
    config: Config = Depends(get_config),
):
    if not config.local_account_enabled:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Local accounts are disabled.")
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
            "This account needs to be confirmed.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    payload = TokenPayload(sub=str(user.id))
    access_token = security.create_jwt_access_token(payload)
    token = AccessToken(
        access_token=access_token,
        token_type="Bearer",
    )

    await user_repo.save(user)
    return token


@router.get("/sign-in/plex")
async def start_signin_plex(config: Config = Depends(get_config)):
    request_pin_url = utils.make_url(
        config.plex_token_url,
        queries_dict={
            "strong": "true",
            "X-Plex-Product": "Cheddarr",
            "X-Plex-Client-Identifier": config.client_id,
        },
    )
    return request_pin_url


@router.post("/sign-in/plex/authorize")
async def authorize_signin_plex(
    request: Request, auth_data: PlexAuthorizeSignin, config: Config = Depends(get_config)
):
    forward_url = re.sub(
        f"{config.api_prefix}/v[0-9]+", "", request.url_for("confirm_signin_plex")
    )
    token = Token(
        {
            "key": auth_data.key,
            "code": auth_data.code,
            "redirect_uri": auth_data.redirect_uri,
            "user_id": auth_data.user_id,
        }
    )
    authorize_url = (
        utils.make_url(
            config.plex_authorize_url,
            queries_dict={
                "context[device][product]": "Cheddarr",
                "clientID": config.client_id,
                "code": auth_data.code,
                "forwardUrl": forward_url,
            },
        )
        + "?token="
        + token.signed_data
    )

    return RedirectResponse(url=authorize_url, status_code=200)


@router.get(
    "/sign-in/plex/confirm",
    response_model=AccessToken,
    responses={
        status.HTTP_500_INTERNAL_SERVER_ERROR: {"description": "Plex authorization error"},
        status.HTTP_201_CREATED: {"model": UserSchema, "description": "User created"},
    },
)
async def confirm_signin_plex(
    token: str,
    response: Response,
    user_repo: UserRepository = Depends(deps.get_repository(UserRepository)),
    config: Config = Depends(get_config),
):
    payload = Token.unsign(token)
    state = payload.get("key")
    code = payload.get("code")
    redirect_uri = payload.get("redirect_uri", "")
    user_id = payload.get("user_id", None)

    access_url = utils.make_url(
        config.plex_token_url + state,
        queries_dict={
            "code": code,
            "X-Plex-Client-Identifier": config.client_id,
        },
    )

    try:
        resp = await HttpClient.request("GET", access_url, headers={"Accept": "application/json"})

        auth_token = resp.get("authToken")

        resp = await HttpClient.request(
            "GET",
            config.plex_user_resource_url,
            headers={"X-Plex-Token": auth_token, "Accept": "application/json"},
        )
    except HTTPException as e:
        raise HTTPException(
            status.HTTP_500_INTERNAL_SERVER_ERROR,
            f"Error while logging with Plex. Received: {e.detail}",
        )

    plex_user_id = resp["id"]
    plex_email = resp["email"]
    plex_username = resp["username"]
    plex_avatar = resp["thumb"]

    # Find this plex account in the database, or create it with the corresponding user
    user = await user_repo.find_by(plex_user_id=plex_user_id)
    if user is None:
        if user_id is not None:
            user = await user_repo.find_by(id=user_id)
            if user is None:
                raise HTTPException(status.HTTP_404_NOT_FOUND, "No user with this id exist")
        else:
            user = await user_repo.find_by_email(plex_email)
            if user is None:
                if not config.signup_enabled:
                    raise HTTPException(status.HTTP_403_FORBIDDEN, "The sign-up is disabled")

                if await user_repo.find_by_username(plex_username) is not None:
                    plex_username = f"{plex_username}{randrange(1, 999)}"
                user = User(
                    username=plex_username,
                    email=plex_email,
                    password=security.get_random_password(),
                    plex_user_id=plex_user_id,
                    plex_api_key=auth_token,
                    avatar=plex_avatar,
                )
                # First signed-up user
                if await user_repo.count() == 0:
                    user.roles = UserRole.admin
                    user.confirmed = True
                await user_repo.save(user)
                return JSONResponse(
                    UserSchema.from_orm(user).json(),
                    status.HTTP_201_CREATED,
                    headers={"redirect-uri": redirect_uri},
                )

    if not user.confirmed:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            "This account needs to be confirmed.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Update the Plex account with the API key (possibly different at each login)
    if user.plex_user_id is None:
        user.plex_user_id = plex_user_id
    if user.email is None:
        user.email = plex_email
    user.avatar = plex_avatar
    user.plex_api_key = auth_token

    await user_repo.save(user)

    payload = TokenPayload(sub=str(user.id))
    access_token = security.create_jwt_access_token(payload)
    response.headers["redirect-uri"] = redirect_uri

    return AccessToken(access_token=access_token, token_type="bearer")
