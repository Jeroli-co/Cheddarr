from fastapi import APIRouter, Body, Depends, HTTPException, Request, status
from pydantic import EmailStr

from server.api import dependencies as deps
from server.api.dependencies import CurrentUser
from server.core import utils
from server.core.scheduler import scheduler
from server.core.security import check_permissions
from server.models.notifications import Agent
from server.models.users import Token, User, UserRole
from server.repositories.notifications import NotificationAgentRepository
from server.repositories.users import (
    TokenRepository,
    UserRepository,
)
from server.schemas.base import PaginatedResponse
from server.schemas.users import (
    UserProfile,
    UserSchema,
    UserUpdate,
)

users_router = APIRouter()
current_user_router = APIRouter()


##########################################
# Users                                  #
##########################################


@users_router.get(
    "",
    dependencies=[
        Depends(deps.get_current_user),
        Depends(deps.has_user_permissions([UserRole.manage_users])),
    ],
    response_model=PaginatedResponse[UserProfile],
)
async def get_users(
    page: int = 1,
    per_page: int = 10,
    confirmed: bool | None = True,
    *,
    user_repo: UserRepository = Depends(deps.get_repository(UserRepository)),
) -> PaginatedResponse[UserProfile]:
    users = await user_repo.find_by(confirmed=confirmed).paginate(page=page, per_page=per_page)

    return PaginatedResponse[UserProfile](page=users.page, total=users.total, pages=users.pages, results=users.items)


@users_router.get(
    "/{user_id}",
    dependencies=([Depends(deps.get_current_user)]),
    response_model=UserProfile,
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "User not found"},
    },
)
async def get_user_by_id(
    user_id: int,
    *,
    user_repo: UserRepository = Depends(deps.get_repository(UserRepository)),
) -> User:
    user = await user_repo.find_by(id=user_id).one()
    if user is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No user with this id exists.")

    return user


@users_router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: int,
    *,
    current_user: CurrentUser,
    user_repo: UserRepository = Depends(deps.get_repository(UserRepository)),
) -> None:
    if current_user.id != user_id and not check_permissions(current_user.roles, [UserRole.admin]):
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Not enough privileges to update the user.")

    user = await user_repo.find_by(id=user_id).one()
    if user is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found.")

    if check_permissions(user.roles, [UserRole.admin]) and await user_repo.count(roles=UserRole.admin) == 1:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Cannot delete last admin user.")

    await user_repo.remove(user)


@users_router.patch(
    "/{user_id}",
    response_model=UserSchema,
    responses={
        status.HTTP_401_UNAUTHORIZED: {"description": "Passwords mismatch"},
        status.HTTP_409_CONFLICT: {"description": "Username or email not available"},
    },
)
async def update_user(
    user_id: int,
    user_in: UserUpdate,
    *,
    current_user: CurrentUser,
    user_repo: UserRepository = Depends(deps.get_repository(UserRepository)),
) -> User:
    if current_user.id != user_id and not check_permissions(current_user.roles, [UserRole.admin]):
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Not enough privileges to update the user.")

    user = await user_repo.find_by(id=user_id).one()
    if user is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found.")

    if user_in.username is not None:
        if await user_repo.find_by_username(user_in.username).one():
            raise HTTPException(status.HTTP_409_CONFLICT, "This username is already taken.")
        user.username = user_in.username

    if user_in.password is not None:
        if user_in.old_password is None:
            raise HTTPException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                "Missing old password to change to a new password.",
            )

        if not user.verify_password(user_in.old_password):
            raise HTTPException(status.HTTP_401_UNAUTHORIZED, "The passwords don't match.")
        user.password = user_in.password

    if user_in.email is not None:
        if await user_repo.find_by_email(user_in.email).one():
            raise HTTPException(status.HTTP_409_CONFLICT, "This email is already taken.")

        user.email = user_in.email

    if user_in.roles is not None:
        if user.id == current_user.id:
            raise HTTPException(status.HTTP_403_FORBIDDEN, "Cannot change user's own roles.")
        if not check_permissions(current_user.roles, [UserRole.admin]):
            raise HTTPException(status.HTTP_403_FORBIDDEN, "Not enough privileges to change the user's roles.")
        user.roles = user_in.roles

    if user_in.confirmed is not None:
        if not check_permissions(current_user.roles, [UserRole.admin]):
            raise HTTPException(
                status.HTTP_403_FORBIDDEN,
                "Not enough privileges to change the user's confirmed status.",
            )
        user.confirmed = user_in.confirmed

    await user_repo.save(user)

    return user


##########################################
# Current User                           #
##########################################


@current_user_router.get("", response_model=UserSchema)
async def get_current_user(current_user: CurrentUser) -> User:
    return current_user


@current_user_router.put(
    "/password",
    status_code=status.HTTP_202_ACCEPTED,
    responses={
        status.HTTP_400_BAD_REQUEST: {"description": "No email agent"},
        status.HTTP_404_NOT_FOUND: {"description": "User not found"},
    },
)
async def reset_password(
    request: Request,
    email: EmailStr = Body(..., embed=True),
    *,
    user_repo: UserRepository = Depends(deps.get_repository(UserRepository)),
    token_repo: TokenRepository = Depends(deps.get_repository(TokenRepository)),
    notif_agent_repo: NotificationAgentRepository = Depends(
        deps.get_repository(NotificationAgentRepository),
    ),
) -> None:
    email_agent = await notif_agent_repo.find_by(name=Agent.email).one()
    if email_agent is None or not email_agent.enabled:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "No email agent is enabled.")

    user = await user_repo.find_by_email(email).one()
    if user is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No user registered with this email.")

    token = Token(data={"email": user.email})
    await token_repo.save(token)

    scheduler.add_job(
        utils.send_email,
        kwargs={
            "email_settings": email_agent.settings,
            "to_email": email,
            "subject": "Reset your password",
            "html_template_name": "email/reset_password_instructions.html",
            "environment": {"reset_url": request.url_for("check_reset_password", token=token)},
        },
    )


@current_user_router.get(
    "/password/{token}",
    status_code=status.HTTP_202_ACCEPTED,
    responses={
        status.HTTP_403_FORBIDDEN: {"description": "Invalid reset link"},
        status.HTTP_404_NOT_FOUND: {"description": "User not found"},
        status.HTTP_410_GONE: {"description": "Nonexistent or expired reset request"},
    },
)
async def check_reset_password(
    token: str,
    *,
    user_repo: UserRepository = Depends(deps.get_repository(UserRepository)),
    token_repo: TokenRepository = Depends(deps.get_repository(TokenRepository)),
) -> None:
    payload = Token.unsign(token)
    if payload is None:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "The reset link is invalid.")

    reset = await token_repo.find_by(id=payload["id"]).one()
    if reset is None or reset.is_expired:
        raise HTTPException(status.HTTP_410_GONE, "This reset request does not exist or has expired.")

    user = await user_repo.find_by_email(payload["email"]).one()
    if user is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No user with with this email was found.")


@current_user_router.post(
    "/password/{token}",
    status_code=status.HTTP_204_NO_CONTENT,
    responses={
        status.HTTP_400_BAD_REQUEST: {"description": "No email agent"},
        status.HTTP_403_FORBIDDEN: {"description": "Invalid reset link"},
        status.HTTP_404_NOT_FOUND: {"description": "User not found"},
        status.HTTP_410_GONE: {"description": "Nonexistent or expired reset request"},
    },
)
async def confirm_reset_password(
    token: str,
    password: str = Body(..., embed=True),
    *,
    user_repo: UserRepository = Depends(deps.get_repository(UserRepository)),
    token_repo: TokenRepository = Depends(deps.get_repository(TokenRepository)),
) -> None:
    payload = Token.unsign(token)
    if payload is None:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "The reset link is invalid.")

    reset = await token_repo.find_by(id=payload["id"]).one()
    if reset is None or reset.is_expired:
        raise HTTPException(status.HTTP_410_GONE, "This reset request does not exist or has expired.")

    user = await user_repo.find_by_email(payload["email"]).one()
    if user is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No user with with this email was found.")

    user.password = password

    await user_repo.save(user)
    await token_repo.remove(reset)
