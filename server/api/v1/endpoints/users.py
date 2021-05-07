from typing import List

from fastapi import APIRouter, Depends, HTTPException, Request, status
from pydantic import EmailStr

from server.api import dependencies as deps
from server.core import config, security, utils
from server.core.scheduler import scheduler
from server.core.security import check_permissions
from server.models.notifications import Agent
from server.models.users import User, UserRole
from server.repositories.notifications import NotificationAgentRepository
from server.repositories.users import (
    UserRepository,
)
from server.schemas.auth import EmailConfirm
from server.schemas.core import ResponseMessage
from server.schemas.users import (
    PasswordResetConfirm,
    PasswordResetCreate,
    UserSchema,
    UserSearchResult,
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
    response_model=UserSearchResult,
)
async def get_users(
    page: int = 1,
    per_page: int = 10,
    user_repo: UserRepository = Depends(deps.get_repository(UserRepository)),
):
    users, total_results, total_pages = await user_repo.find_all_by(page=page, per_page=per_page)
    return UserSearchResult(
        page=page, total_results=total_results, total_pages=total_pages, results=users
    )


@users_router.get(
    "/{user_id}",
    dependencies=([Depends(deps.get_current_user)]),
    response_model=UserSchema,
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "User not found"},
    },
)
async def get_user_by_id(
    user_id: int,
    user_repo: UserRepository = Depends(deps.get_repository(UserRepository)),
):
    user = await user_repo.find_by(id=user_id)
    if user is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No user with this id exists.")
    return user


@users_router.delete("/{user_id}", response_model=ResponseMessage)
async def delete_user(
    user_id: int,
    current_user: User = Depends(deps.get_current_user),
    user_repo: UserRepository = Depends(deps.get_repository(UserRepository)),
):
    if current_user.id != user_id or not check_permissions(current_user.roles, [UserRole.admin]):
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Not enough privileges to update the user.")
    await user_repo.remove(current_user)
    return {"detail": "User deleted."}


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
    request: Request,
    current_user: User = Depends(deps.get_current_user),
    user_repo: UserRepository = Depends(deps.get_repository(UserRepository)),
    notif_agent_repo: NotificationAgentRepository = Depends(
        deps.get_repository(NotificationAgentRepository)
    ),
):
    if current_user.id != user_id or not check_permissions(current_user.roles, [UserRole.admin]):
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Not enough privileges to update the user.")
    user = await user_repo.find_by(id=user_id)

    email_agent = await notif_agent_repo.find_by(name=Agent.email)

    if user_in.username is not None:
        if await user_repo.find_by_username(user_in.username):
            raise HTTPException(status.HTTP_409_CONFLICT, "This username is already taken.")
        user.username = user_in.username

    if user_in.password is not None:
        if user_in.old_password is None:
            raise HTTPException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                "Missing old password to change to a new password.",
            )

        if not security.verify_password(user_in.old_password, user.password):
            raise HTTPException(status.HTTP_401_UNAUTHORIZED, "The passwords don't match.")
        user.password = user_in.password
        if config.MAIL_ENABLED:
            if email_agent is None or not email_agent.enabled:
                raise HTTPException(status.HTTP_400_BAD_REQUEST, "No email agent is enabled")

            scheduler.add_job(
                utils.send_email,
                kwargs=dict(
                    email_settings=email_agent.settings,
                    to_email=user.email,
                    subject="Your password has been changed",
                    html_template_name="email/change_password_notice.html",
                ),
            )

    if user_in.email is not None:
        if await user_repo.find_by_email(user_in.email):
            raise HTTPException(status.HTTP_409_CONFLICT, "This email is already taken.")
        if config.MAIL_ENABLED:
            if email_agent is None or not email_agent.enabled:
                raise HTTPException(status.HTTP_400_BAD_REQUEST, "No email agent is enabled")

            email_data = EmailConfirm(email=user_in.email, old_email=EmailStr(user.email)).dict()
            token = security.generate_timed_token(email_data)
            scheduler.add_job(
                utils.send_email,
                kwargs=dict(
                    email_settings=email_agent.settings,
                    to_email=user_in.email,
                    subject="Please confirm your new email",
                    html_template_name="email/email_confirmation.html",
                    environment=dict(confirm_url=request.url_for("confirm_email", token=token)),
                ),
            )
        else:
            user.email = user_in.email

    if user_in.roles is not None:
        if not check_permissions(current_user.roles, [UserRole.admin]):
            raise HTTPException(
                status.HTTP_403_FORBIDDEN, "Not enough privileges to change the user's roles."
            )
        user.roles = user_in.roles

    await user_repo.save(user)
    return user


@users_router.get(
    "/search",
    response_model=List[UserSchema],
    dependencies=[Depends(deps.get_current_user)],
)
async def search_users(
    value: str,
    user_repo: UserRepository = Depends(deps.get_repository(UserRepository)),
):
    search = await user_repo.search_by("username", value)
    return search


##########################################
# Current User                           #
##########################################


@current_user_router.get("", response_model=UserSchema)
async def get_current_user(current_user: User = Depends(deps.get_current_user)):
    return current_user


@current_user_router.put(
    "/password",
    response_model=ResponseMessage,
    responses={
        status.HTTP_400_BAD_REQUEST: {"description": "No email agent"},
        status.HTTP_404_NOT_FOUND: {
            "description": "User not found",
        },
    },
)
async def reset_password(
    email_data: PasswordResetCreate,
    request: Request,
    user_repo: UserRepository = Depends(deps.get_repository(UserRepository)),
    notif_agent_repo: NotificationAgentRepository = Depends(
        deps.get_repository(NotificationAgentRepository)
    ),
):
    email_agent = await notif_agent_repo.find_by(name=Agent.email)
    if email_agent is None or not email_agent.enabled:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "No email agent is enabled")

    email = email_data.email
    user = await user_repo.find_by_email(email_data.email)
    if user is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No user registered with this email.")

    token = security.generate_timed_token(user.email)
    scheduler.add_job(
        utils.send_email,
        kwargs=dict(
            email_settings=email_agent.settings,
            to_email=email,
            subject="Reset your password",
            html_template_name="email/reset_password_instructions.html",
            environment=dict(reset_url=request.url_for("check_reset_password", token=token)),
        ),
    )
    return {"detail": "Reset instructions sent."}


@current_user_router.get(
    "/password/{token}",
    status_code=status.HTTP_202_ACCEPTED,
    response_model=ResponseMessage,
    responses={
        status.HTTP_404_NOT_FOUND: {
            "description": "User not found",
        },
        status.HTTP_410_GONE: {"description": "Invalid or expired link "},
    },
)
async def check_reset_password(
    token: str,
    user_repo: UserRepository = Depends(deps.get_repository(UserRepository)),
):
    try:
        email = security.confirm_timed_token(token)
    except Exception:
        raise HTTPException(status.HTTP_410_GONE, "The reset link is invalid or has expired.")

    user = await user_repo.find_by_email(email)
    if user is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No user with with this email was found.")

    return {"detail": "Able to reset."}


@current_user_router.post(
    "/password/{token}",
    response_model=ResponseMessage,
    responses={
        status.HTTP_400_BAD_REQUEST: {"description": "No email agent"},
        status.HTTP_404_NOT_FOUND: {
            "description": "User not found",
        },
        status.HTTP_410_GONE: {"description": "Invalid or expired link"},
    },
)
async def confirm_reset_password(
    token: str,
    password: PasswordResetConfirm,
    user_repo: UserRepository = Depends(deps.get_repository(UserRepository)),
    notif_agent_repo: NotificationAgentRepository = Depends(
        deps.get_repository(NotificationAgentRepository)
    ),
):
    email_agent = await notif_agent_repo.find_by(name=Agent.email)
    if email_agent is None or not email_agent.enabled:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "No email agent is enabled")

    try:
        email = security.confirm_timed_token(token)
    except Exception:
        raise HTTPException(status.HTTP_410_GONE, "The reset link is invalid or has expired.")

    user = await user_repo.find_by_email(email)
    if user is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No user with with this email was found.")

    user.password = password
    await user_repo.save(user)
    scheduler.add_job(
        utils.send_email,
        kwargs=dict(
            email_settings=email_agent.settings,
            to_email=user.email,
            subject="Your password has been reset",
            html_template_name="email/reset_password_notice.html",
        ),
    )
    return {"detail": "Password reset."}
