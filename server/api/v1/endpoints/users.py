from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Request, status
from pydantic import EmailStr

from server.api import dependencies as deps
from server.core import config, security, utils
from server.core.scheduler import scheduler
from server.models.notifications import Agent
from server.models.settings import MediaProviderType
from server.models.users import Friendship, User
from server.repositories.notifications import NotificationAgentRepository
from server.repositories.users import (
    FriendshipRepository,
    UserRepository,
)
from server.schemas.auth import EmailConfirm
from server.schemas.core import ResponseMessage
from server.schemas.users import (
    FriendshipCreate,
    PasswordResetConfirm,
    PasswordResetCreate,
    UserPublicSchema,
    UserSchema,
    UserUpdate,
)

users_router = APIRouter()
current_user_router = APIRouter()


##########################################
# Users                                  #
##########################################


@users_router.get(
    "/{id:int}",
    dependencies=([Depends(deps.get_current_user)]),
    response_model=UserPublicSchema,
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "User not found"},
    },
)
async def get_user_by_id(
    id: int,
    user_repo: UserRepository = Depends(deps.get_repository(UserRepository)),
):
    user = await user_repo.find_by(id=id)
    if user is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No user with this id exists.")
    return user


@users_router.get(
    "/{username:str}",
    dependencies=([Depends(deps.get_current_user)]),
    response_model=UserPublicSchema,
    responses={
        status.HTTP_404_NOT_FOUND: {
            "description": "User not found",
        },
    },
)
async def get_user_by_username(
    username: str,
    user_repo: UserRepository = Depends(deps.get_repository(UserRepository)),
):
    user = await user_repo.find_by_username(username)
    if user is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No user with this username exists.")
    return user


##########################################
# Current User                           #
##########################################


@current_user_router.get("", response_model=UserSchema)
async def get_current_user(current_user: User = Depends(deps.get_current_user)):
    return current_user


@current_user_router.delete("", response_model=ResponseMessage)
async def delete_user(
    current_user: User = Depends(deps.get_current_user),
    user_repo: UserRepository = Depends(deps.get_repository(UserRepository)),
):
    await user_repo.remove(current_user)
    return {"detail": "User deleted."}


@current_user_router.patch(
    "",
    response_model=UserSchema,
    responses={
        status.HTTP_401_UNAUTHORIZED: {"description": "Passwords mismatch"},
        status.HTTP_409_CONFLICT: {"description": "Username or email not available"},
    },
)
async def update_user(
    user_in: UserUpdate,
    request: Request,
    current_user: User = Depends(deps.get_current_user),
    user_repo: UserRepository = Depends(deps.get_repository(UserRepository)),
    notif_agent_repo: NotificationAgentRepository = Depends(
        deps.get_repository(NotificationAgentRepository)
    ),
):
    email_agent = await notif_agent_repo.find_by(name=Agent.email)

    if user_in.username is not None:
        if await user_repo.find_by_username(user_in.username):
            raise HTTPException(status.HTTP_409_CONFLICT, "This username is already taken.")
        current_user.username = user_in.username

    if user_in.password is not None:
        if user_in.old_password is None:
            raise HTTPException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                "Missing old password to change to a new password.",
            )

        if not security.verify_password(user_in.old_password, current_user.password):
            raise HTTPException(status.HTTP_401_UNAUTHORIZED, "The passwords don't match.")
        current_user.password = user_in.password
        if config.MAIL_ENABLED:
            if email_agent is None or not email_agent.enabled:
                raise HTTPException(status.HTTP_400_BAD_REQUEST, "No email agent is enabled")

            scheduler.add_job(
                utils.send_email,
                kwargs=dict(
                    email_settings=email_agent.settings,
                    to_email=current_user.email,
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

            email_data = EmailConfirm(
                email=user_in.email, old_email=EmailStr(current_user.email)
            ).dict()
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
            current_user.email = user_in.email

    await user_repo.save(current_user)
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


##########################################
# Friends                                #
##########################################


@current_user_router.get("/friends", response_model=List[UserPublicSchema], tags=["friends"])
async def get_friends(
    provider_type: Optional[MediaProviderType] = None,
    current_user: User = Depends(deps.get_current_user),
    friendship_repo: FriendshipRepository = Depends(deps.get_repository(FriendshipRepository)),
):
    friendships = await friendship_repo.find_all_by_user_id(current_user.id, pending=False)
    friends = [
        friendship.requesting_user
        if friendship.requesting_user != current_user
        else friendship.requested_user
        for friendship in friendships
    ]
    if provider_type is not None:
        friends.append(current_user)
        return [
            friend
            for friend in friends
            if next(
                (
                    provider
                    for provider in friend.media_providers
                    if provider.provider_type == provider_type and provider.enabled is True
                ),
                None,
            )
        ]

    return friends


@current_user_router.get(
    "/friends/incoming", response_model=List[UserPublicSchema], tags=["friends"]
)
async def get_pending_incoming_friends(
    current_user: User = Depends(deps.get_current_user),
    friendship_repo: FriendshipRepository = Depends(deps.get_repository(FriendshipRepository)),
):
    friendships = await friendship_repo.find_all_by(
        requested_user_id=current_user.id, pending=True
    )
    return [friendship.requesting_user for friendship in friendships]


@current_user_router.get(
    "/friends/outgoing", response_model=List[UserPublicSchema], tags=["friends"]
)
async def get_pending_outgoing_friends(
    current_user: User = Depends(deps.get_current_user),
    friendship_repo: FriendshipRepository = Depends(deps.get_repository(FriendshipRepository)),
):
    friendships = await friendship_repo.find_all_by(
        requesting_user_id=current_user.id, pending=True
    )
    return [friendship.requested_user for friendship in friendships]


@current_user_router.post(
    "/friends",
    status_code=status.HTTP_201_CREATED,
    response_model=UserPublicSchema,
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "User not found"},
        status.HTTP_409_CONFLICT: {"description": "Already friends"},
    },
    tags=["friends"],
)
async def add_friend(
    friend: FriendshipCreate,
    current_user: User = Depends(deps.get_current_user),
    user_repo: UserRepository = Depends(deps.get_repository(UserRepository)),
    friendship_repo: FriendshipRepository = Depends(deps.get_repository(FriendshipRepository)),
):
    friend = await user_repo.find_by_username_or_email(friend.username_or_email)
    if friend is None or friend == current_user or not friend.confirmed:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "The user does not exist.")

    if await friendship_repo.find_by_user_ids(current_user.id, friend.id) is not None:
        raise HTTPException(status.HTTP_409_CONFLICT, "This user is already a friend.")

    friendship = Friendship(requesting_user_id=current_user.id, requested_user_id=friend.id)
    await friendship_repo.save(friendship)
    return friendship.requested_user


@current_user_router.patch(
    "/friends/{username}",
    response_model=UserPublicSchema,
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "User not found"},
        status.HTTP_403_FORBIDDEN: {"description": "Not friends"},
    },
    tags=["friends"],
)
async def accept_friend(
    username,
    current_user: User = Depends(deps.get_current_user),
    user_repo: UserRepository = Depends(deps.get_repository(UserRepository)),
    friendship_repo: FriendshipRepository = Depends(deps.get_repository(FriendshipRepository)),
):
    friend = await user_repo.find_by_username(username)
    if friend is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "The user does not exist.")

    friendship = await friendship_repo.find_by_user_ids(current_user.id, friend.id)
    if friendship is None:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "This user is not in your friend list.")
    friendship.pending = False
    await friendship_repo.save(friendship)
    return friend


@current_user_router.delete(
    "/friends/{username}",
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "User not found"},
        status.HTTP_403_FORBIDDEN: {"description": "Not friends"},
    },
    tags=["friends"],
)
async def remove_friend(
    username: str,
    current_user: User = Depends(deps.get_current_user),
    user_repo: UserRepository = Depends(deps.get_repository(UserRepository)),
    friendship_repo: FriendshipRepository = Depends(deps.get_repository(FriendshipRepository)),
):
    friend = await user_repo.find_by_username(username)
    if friend is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "The user does not exist.")

    friendship = await friendship_repo.find_by_user_ids(current_user.id, friend.id)
    if friendship is None:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "This user is not in your friend list.")

    await friendship_repo.remove(friendship)
    return {"detail": "Friend removed."}


@current_user_router.get(
    "/friends/search", response_model=List[UserPublicSchema], tags=["friends"]
)
async def search_friends(
    value: str,
    current_user: User = Depends(deps.get_current_user),
    user_repo: UserRepository = Depends(deps.get_repository(UserRepository)),
):
    search = await user_repo.search_by("username", value)
    friendships = current_user.incoming_friendships + current_user.outgoing_friendships
    friends = [
        friendship.requesting_user
        if friendship.requesting_user != current_user
        else friendship.requested_user
        for friendship in friendships
    ]
    return [user for user in search if user in friends]
