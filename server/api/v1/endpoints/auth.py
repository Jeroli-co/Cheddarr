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

from server.api import dependencies as deps
from server.api.dependencies import AppConfig
from server.core import security, utils
from server.core.config import Config, get_config
from server.core.scheduler import scheduler
from server.models.notifications import Agent
from server.models.users import Token, User, UserRole
from server.repositories.notifications import NotificationAgentRepository
from server.repositories.users import TokenRepository, UserRepository
from server.schemas.auth import AccessToken, AccessTokenPayload, Invitation, PlexAuthorizeSignin
from server.schemas.base import ResponseMessage
from server.schemas.users import UserCreate, UserLogin
from server.services import plex

router = APIRouter()


@router.post(
    "/sign-up",
    status_code=status.HTTP_201_CREATED,
    responses={
        status.HTTP_403_FORBIDDEN: {"description": "Sign-up disabled or invalid invitation"},
        status.HTTP_409_CONFLICT: {"description": "Email or username not available"},
    },
)
async def signup(
    user_in: UserCreate,
    invitation_token: str | None = None,
    *,
    config: AppConfig,
    user_repo: UserRepository = Depends(deps.get_repository(UserRepository)),
    token_repo: TokenRepository = Depends(deps.get_repository(TokenRepository)),
) -> AccessToken | None:
    first_user = await user_repo.count() == 0
    confirmed = first_user or invitation_token is not None

    if not first_user and not config.signup_enabled and invitation_token is None:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "The sign-up is disabled.")

    if invitation_token is not None:
        token_payload = Token.unsign(invitation_token)
        if token_payload is None:
            raise HTTPException(status.HTTP_403_FORBIDDEN, "This invitation is not valid.")

        invitation = await token_repo.find_by(id=token_payload["id"]).one()
        if invitation is None or invitation.is_expired:
            raise HTTPException(status.HTTP_403_FORBIDDEN, "This invitation is not valid or has expired.")

        if user_in.email != token_payload["email"]:
            raise HTTPException(status.HTTP_403_FORBIDDEN, "Invalid user information.")

        if invitation.max_uses is not None and invitation.max_uses > 0:
            invitation.max_uses -= 1
            await token_repo.save(invitation)
            if invitation.max_uses == 0:
                await token_repo.remove(invitation)

    if user_in.email is not None:
        existing_email = await user_repo.find_by_email(email=user_in.email).one()
        if existing_email:
            raise HTTPException(status.HTTP_409_CONFLICT, "This email is already taken.")

    existing_username = await user_repo.find_by_username(user_in.username).one()
    if existing_username:
        raise HTTPException(status.HTTP_409_CONFLICT, "This username is already taken.")
    user = user_in.to_orm(User)

    if first_user:
        user.roles = UserRole.admin
    if confirmed:
        user.confirmed = True

    await user_repo.save(user)

    if confirmed:
        access_token = security.create_jwt_access_token(AccessTokenPayload(sub=user.id))

        return AccessToken(
            access_token=access_token,
            token_type="Bearer",
        )

    return None


@router.get(
    "/sign-up/{token}",
    status_code=status.HTTP_202_ACCEPTED,
    response_model=ResponseMessage,
    responses={
        status.HTTP_403_FORBIDDEN: {"description": "Invalid invitation link"},
        status.HTTP_410_GONE: {"description": "Nonexistent or expired invitation"},
    },
)
async def check_sign_up_invitation(
    token: str,
    *,
    token_repo: TokenRepository = Depends(deps.get_repository(TokenRepository)),
) -> ResponseMessage:
    data = Token.unsign(token)
    if data is None:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "The invitation link is invalid.")

    invitation = await token_repo.find_by(id=data["id"]).one()
    if invitation is None or invitation.is_expired:
        raise HTTPException(status.HTTP_410_GONE, "This invitation does not exist or has expired.")

    return ResponseMessage(detail=data)


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
    *,
    user_repo: UserRepository = Depends(deps.get_repository(UserRepository)),
    token_repo: TokenRepository = Depends(deps.get_repository(TokenRepository)),
    notif_agent_repo: NotificationAgentRepository = Depends(deps.get_repository(NotificationAgentRepository)),
) -> ResponseMessage:
    token = Token(
        data=invitation.model_dump(include={"email"}),
        max_uses=invitation.max_uses,
        max_age=invitation.max_age,
    )
    await token_repo.save(token)
    invitation_link = str(request.url_for("check_sign_up_invitation", token=token.data))

    if invitation.email is not None:
        if await user_repo.find_by_email(invitation.email).one() is not None:
            raise HTTPException(
                status.HTTP_409_CONFLICT,
                "User already registered with this email.",
            )
        email_agent = await notif_agent_repo.find_by(name=Agent.email).one()
        if email_agent is not None and email_agent.enabled:
            scheduler.add_job(
                utils.send_email,
                kwargs={
                    "email_options": email_agent.settings,
                    "to_email": invitation.email,
                    "subject": "Create your Cheddarr account",
                    "html_template_name": "email/invitation.html",
                    "environment": {"invitation_url": invitation_link},
                },
            )

    return ResponseMessage(detail=invitation_link)


@router.post(
    "/sign-in",
    responses={
        status.HTTP_401_UNAUTHORIZED: {"description": "Wrong credentials or account needs to be confirmed "},
        status.HTTP_403_FORBIDDEN: {"description": "Local accounts disabled"},
    },
)
async def signin(
    form: UserLogin,
    *,
    config: AppConfig,
    user_repo: UserRepository = Depends(deps.get_repository(UserRepository)),
) -> AccessToken:
    if not config.local_account_enabled:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Local accounts are disabled.")
    user = await user_repo.find_by_username_or_email(form.username).one()
    if user is None or not user.verify_password(form.password.get_secret_value()):
        raise HTTPException(
            status.HTTP_401_UNAUTHORIZED,
            "Wrong username/email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.confirmed:
        raise HTTPException(
            status.HTTP_401_UNAUTHORIZED,
            "This account needs to be confirmed.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    await user_repo.save(user)

    access_token = security.create_jwt_access_token(AccessTokenPayload(sub=user.id))
    return AccessToken(
        access_token=access_token,
        token_type="Bearer",
    )


@router.get("/sign-in/plex")
async def start_signin_plex(config: Config = Depends(get_config)) -> str:
    return utils.make_url(
        str(config.plex_token_url),
        queries_dict={
            "strong": "true",
            "X-Plex-Product": "Cheddarr",
            "X-Plex-Client-Identifier": config.client_id,
        },
    )


@router.post("/sign-in/plex/authorize")
async def authorize_signin_plex(
    request: Request,
    auth_data: PlexAuthorizeSignin,
    *,
    config: AppConfig,
) -> RedirectResponse:
    authorize_url = (
        utils.make_url(
            str(config.plex_authorize_url),
            queries_dict={
                "context[device][product]": "Cheddarr",
                "clientID": config.client_id,
                "code": auth_data.code,
                "forwardUrl": re.sub("/api/v[0-9]+", "", str(request.url_for("confirm_signin_plex"))),
            },
        )
        + "?token="
        + Token(data=auth_data.model_dump()).data
    )

    return RedirectResponse(url=authorize_url, status_code=200)


@router.get(
    "/sign-in/plex/confirm",
    responses={
        status.HTTP_200_OK: {"model": AccessToken, "description": "User logged in"},
        status.HTTP_201_CREATED: {"model": AccessToken | None, "description": "User created"},
        status.HTTP_401_UNAUTHORIZED: {"description": "Account needs to be confirmed "},
        status.HTTP_500_INTERNAL_SERVER_ERROR: {"description": "Plex authorization error"},
    },
)
async def confirm_signin_plex(
    token: str,
    response: Response,
    *,
    config: AppConfig,
    user_repo: UserRepository = Depends(deps.get_repository(UserRepository)),
) -> AccessToken | None:
    payload = Token.unsign(token)
    if payload is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid token.")

    key = payload["key"]
    code = payload["code"]
    redirect_uri = payload.get("redirect_uri", "")
    user_id = payload.get("user_id", None)

    try:
        plex_user = await plex.get_user(config, key, code)
    except HTTPException as e:
        raise HTTPException(
            status.HTTP_500_INTERNAL_SERVER_ERROR,
            f"Error while logging with Plex. Received: {e.status_code} - {e.detail}",
        ) from e

    # Find this plex account in the database, or create it with the corresponding user
    user = await user_repo.find_by(plex_user_id=plex_user.id).one()
    if user is None:
        if user_id is not None:
            user = await user_repo.find_by(id=user_id).one()
            if user is None:
                raise HTTPException(status.HTTP_404_NOT_FOUND, "No user with this id exist")
        else:
            user = await user_repo.find_by_email(plex_user.email).one()
            if user is None and not config.signup_enabled:
                raise HTTPException(status.HTTP_403_FORBIDDEN, "The sign-up is disabled")

            if await user_repo.find_by_username(plex_user.username).one() is not None:
                plex_user.username = f"{plex_user.username}{randrange(1, 999)}"
            user = User(
                username=plex_user.username,
                email=plex_user.email,
                password=security.get_random_password(),
                plex_user_id=plex_user.id,
                plex_api_key=plex_user.api_key,
                avatar=plex_user.thumb,
            )

            response.status_code = status.HTTP_201_CREATED
            response.headers["redirect-uri"] = redirect_uri

            # First signed-up user
            if await user_repo.count() == 0:
                user.roles = UserRole.admin
                user.confirmed = True
            else:
                await user_repo.save(user)

                return None

    if not user.confirmed:
        raise HTTPException(
            status.HTTP_401_UNAUTHORIZED,
            "This account needs to be confirmed.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Update user with up-to-date Plex account info
    if user.plex_user_id is None:
        user.plex_user_id = plex_user.id
    if user.email is None:
        user.email = plex_user.email
    user.avatar = plex_user.thumb
    user.plex_api_key = plex_user.api_key

    await user_repo.save(user)

    access_token = security.create_jwt_access_token(AccessTokenPayload(sub=user.id))
    response.headers["redirect-uri"] = redirect_uri

    return AccessToken(access_token=access_token, token_type="bearer")
