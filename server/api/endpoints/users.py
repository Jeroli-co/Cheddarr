from typing import Optional

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Request, status

from server import models, schemas
from server.api import dependencies as deps
from server.core import security, settings, utils
from server.repositories import FriendshipRepository, UserRepository

users_router = APIRouter()
current_user_router = APIRouter()


@users_router.get(
    "/{id:int}",
    dependencies=([Depends(deps.get_current_user)]),
    response_model=schemas.UserPublic,
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "User not found"},
    },
)
def get_user_by_id(
    id: int,
    user_repo: UserRepository = Depends(deps.get_repository(UserRepository)),
):
    user = user_repo.find_by(id=id)
    if user is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No user with this id exists.")
    return user


@users_router.get(
    "/{username:str}",
    dependencies=([Depends(deps.get_current_user)]),
    response_model=schemas.UserPublic,
    responses={
        status.HTTP_404_NOT_FOUND: {
            "description": "User not found",
        },
    },
)
def get_user_by_username(
    username: str,
    user_repo: UserRepository = Depends(deps.get_repository(UserRepository)),
):
    user = user_repo.find_by_username(username)
    if user is None:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND, "No user with this username exists."
        )
    return user


@current_user_router.get("", response_model=schemas.User)
async def get_current_user(current_user: models.User = Depends(deps.get_current_user)):
    return current_user


@current_user_router.get("/providers")
def get_user_providers(
    type: Optional[models.ProviderType] = None,
    current_user: models.User = Depends(deps.get_current_user),
):
    user_providers = current_user.providers
    if type is not None:
        return [
            provider
            for provider in user_providers
            if provider.provider_type == type and provider.enabled
        ]
    return user_providers


@current_user_router.delete("")
def delete_user(
    current_user: models.User = Depends(deps.get_current_user),
    user_repo: UserRepository = Depends(deps.get_repository(UserRepository)),
):
    user_repo.remove(current_user)
    return {"detail": "User deleted."}


@current_user_router.patch(
    "",
    response_model=schemas.User,
    responses={
        status.HTTP_401_UNAUTHORIZED: {"description": "Passwords mismatch"},
        status.HTTP_409_CONFLICT: {"description": "Username or email not available"},
    },
)
def update_user(
    user_in: schemas.UserUpdate,
    request: Request,
    background_tasks: BackgroundTasks,
    current_user: models.User = Depends(deps.get_current_user),
    user_repo: UserRepository = Depends(deps.get_repository(UserRepository)),
):
    if user_in.username is not None:
        if user_repo.find_by_username(user_in.username):
            raise HTTPException(
                status.HTTP_409_CONFLICT, "This username is already taken."
            )
        current_user.username = user_in.username

    if user_in.password is not None:
        if user_in.old_password is None:
            raise HTTPException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                "Missing old password to change to a new password.",
            )

        if not security.verify_password(user_in.old_password, current_user.password):
            raise HTTPException(
                status.HTTP_401_UNAUTHORIZED, "The passwords don't match."
            )
        current_user.password = user_in.password
        if settings.MAIL_ENABLED:
            background_tasks.add_task(
                utils.send_email,
                to_email=current_user.email,
                subject="Your password has been changed",
                html_template_name="email/change_password_notice.html",
            )

    if user_in.email is not None:
        if user_repo.find_by_email(user_in.email):
            raise HTTPException(
                status.HTTP_409_CONFLICT, "This email is already taken."
            )
        if settings.MAIL_ENABLED:
            email_data = schemas.EmailConfirm(
                email=user_in.email, old_email=current_user.email
            ).dict()
            token = security.generate_timed_token(email_data)
            background_tasks.add_task(
                utils.send_email,
                to_email=user_in.email,
                subject="Please confirm your new email",
                html_template_name="email/email_confirmation.html",
                environment=dict(
                    confirm_url=request.url_for("confirm_email", token=token)
                ),
            )
        else:
            current_user.email = user_in.email

    user_repo.save(current_user)
    return current_user


@current_user_router.put(
    "/password",
    responses={
        status.HTTP_404_NOT_FOUND: {
            "description": "User not found",
        }
    },
)
def reset_password(
    email_data: schemas.PasswordResetCreate,
    request: Request,
    background_tasks: BackgroundTasks,
    user_repo: UserRepository = Depends(deps.get_repository(UserRepository)),
):
    email = email_data.email
    user = user_repo.find_by_email(email_data.email)
    if user is None:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND, "No user registered with this email."
        )
    token = security.generate_timed_token(user.email)
    background_tasks.add_task(
        utils.send_email,
        to_email=email,
        subject="Reset your password",
        html_template_name="email/reset_password_instructions.html",
        environment=dict(
            reset_url=request.url_for("check_reset_password", token=token)
        ),
    )
    return {"detail": "Reset instructions sent."}


@current_user_router.get(
    "/password/{token}",
    status_code=status.HTTP_202_ACCEPTED,
    responses={
        status.HTTP_404_NOT_FOUND: {
            "description": "User not found",
        },
        status.HTTP_410_GONE: {"description": "Invalid or expired link "},
    },
)
def check_reset_password(
    token: str,
    user_repo: UserRepository = Depends(deps.get_repository(UserRepository)),
):
    try:
        email = security.confirm_timed_token(token)
    except Exception:
        raise HTTPException(
            status.HTTP_410_GONE, "The reset link is invalid or has expired."
        )

    user = user_repo.find_by_email(email)
    if user is None:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND, "No user with with this email was found."
        )

    return {"detail": "Able to reset."}


@current_user_router.post(
    "/password/{token}",
    responses={
        status.HTTP_404_NOT_FOUND: {
            "description": "User not found",
        },
        status.HTTP_410_GONE: {"description": "Invalid or expired link "},
    },
)
def confirm_reset_password(
    token: str,
    password: schemas.PasswordResetConfirm,
    background_tasks: BackgroundTasks,
    user_repo: UserRepository = Depends(deps.get_repository(UserRepository)),
):
    try:
        email = security.confirm_timed_token(token)
    except Exception:
        raise HTTPException(
            status.HTTP_410_GONE, "The reset link is invalid or has expired."
        )

    user = user_repo.find_by_email(email)
    if user is None:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND, "No user with with this email was found."
        )

    user.password = password
    user_repo.save(user)
    background_tasks.add_task(
        utils.send_email,
        to_email=user.email,
        subject="Your password has been reset",
        html_template_name="email/reset_password_notice.html",
    )
    return {"detail": "Password reset."}


@current_user_router.get(
    "/friends", response_model=list[schemas.UserPublic], tags=["friends"]
)
def get_friends(
    providers_type: Optional[models.ProviderType] = None,
    current_user: models.User = Depends(deps.get_current_user),
    friendship_repo: FriendshipRepository = Depends(
        deps.get_repository(FriendshipRepository)
    ),
):
    friendships = friendship_repo.find_all_by_user_id(current_user.id, pending=False)
    friends = [
        friendship.requesting_user
        if friendship.requesting_user != current_user
        else friendship.requested_user
        for friendship in friendships
    ]
    if providers_type is not None:
        friends.append(current_user)
        if providers_type == models.ProviderType.movie_provider:
            return [
                friend
                for friend in friends
                if friend.providers.filter_by(
                    provider_type=models.ProviderType.movie_provider, enabled=True
                ).first()
            ]

        if providers_type == models.ProviderType.series_provider:
            return [
                friend
                for friend in friends
                if friend.providers.filter_by(
                    provider_type=models.ProviderType.series_provider, enabled=True
                ).first()
            ]
    return friends


@current_user_router.get(
    "/friends/incoming", response_model=list[schemas.UserPublic], tags=["friends"]
)
def get_pending_incoming_friends(
    current_user: models.User = Depends(deps.get_current_user),
    friendship_repo: FriendshipRepository = Depends(
        deps.get_repository(FriendshipRepository)
    ),
):
    friendships = friendship_repo.find_all_by(
        requested_user_id=current_user.id, pending=True
    )
    return [friendship.requesting_user for friendship in friendships]


@current_user_router.get(
    "/friends/outgoing", response_model=list[schemas.UserPublic], tags=["friends"]
)
def get_pending_outgoing_friends(
    current_user: models.User = Depends(deps.get_current_user),
    friendship_repo: FriendshipRepository = Depends(
        deps.get_repository(FriendshipRepository)
    ),
):
    friendships = friendship_repo.find_all_by(
        requesting_user_id=current_user.id, pending=True
    )
    return [friendship.requested_user for friendship in friendships]


@current_user_router.post(
    "/friends",
    status_code=status.HTTP_201_CREATED,
    response_model=schemas.UserPublic,
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "User not found"},
        status.HTTP_409_CONFLICT: {"description": "Already friends"},
    },
    tags=["friends"],
)
def add_friend(
    friend: schemas.FriendshipCreate,
    current_user: models.User = Depends(deps.get_current_user),
    user_repo: UserRepository = Depends(deps.get_repository(UserRepository)),
    friendship_repo: FriendshipRepository = Depends(
        deps.get_repository(FriendshipRepository)
    ),
):
    friend = user_repo.find_by_username_or_email(friend.username_or_email)
    if friend is None or friend == current_user or not friend.confirmed:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "The user does not exist.")

    if friendship_repo.find_by_user_ids(current_user.id, friend.id) is not None:
        raise HTTPException(status.HTTP_409_CONFLICT, "This user is already a friend.")

    friendship = models.Friendship(
        requesting_user_id=current_user.id, requested_user_id=friend.id
    )
    friendship_repo.save(friendship)
    return friendship.requested_user


@current_user_router.patch(
    "/friends/{username}",
    response_model=schemas.UserPublic,
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "User not found"},
        status.HTTP_403_FORBIDDEN: {"description": "Not friends"},
    },
    tags=["friends"],
)
def accept_friend(
    username,
    current_user: models.User = Depends(deps.get_current_user),
    user_repo: UserRepository = Depends(deps.get_repository(UserRepository)),
    friendship_repo: FriendshipRepository = Depends(
        deps.get_repository(FriendshipRepository)
    ),
):
    friend = user_repo.find_by_username(username)
    if friend is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "The user does not exist.")

    friendship = friendship_repo.find_by_user_ids(current_user.id, friend.id)
    if friendship is None:
        raise HTTPException(
            status.HTTP_403_FORBIDDEN, "This user is not in your friend list."
        )
    friendship.pending = False
    friendship_repo.save(friendship)
    return friend


@current_user_router.delete(
    "/friends/{username}",
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "User not found"},
        status.HTTP_403_FORBIDDEN: {"description": "Not friends"},
    },
    tags=["friends"],
)
def remove_friend(
    username: str,
    current_user: models.User = Depends(deps.get_current_user),
    user_repo: UserRepository = Depends(deps.get_repository(UserRepository)),
    friendship_repo: FriendshipRepository = Depends(
        deps.get_repository(FriendshipRepository)
    ),
):
    friend = user_repo.find_by_username(username)
    if friend is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "The user does not exist.")

    friendship = friendship_repo.find_by_user_ids(current_user.id, friend.id)
    if friendship is None:
        raise HTTPException(
            status.HTTP_403_FORBIDDEN, "This user is not in your friend list."
        )

    friendship_repo.remove(friendship)
    return {"detail": "Friend removed."}


@current_user_router.get(
    "/friends/search", response_model=list[schemas.UserPublic], tags=["friends"]
)
def search_friends(
    value: str,
    current_user: models.User = Depends(deps.get_current_user),
    user_repo: UserRepository = Depends(deps.get_repository(UserRepository)),
):
    search = user_repo.search_by("username", value)
    friendships = current_user.incoming_friendships + current_user.outgoing_friendships
    friends = [
        friendship.requesting_user
        if friendship.requesting_user != current_user
        else friendship.requested_user
        for friendship in friendships
    ]
    return [user for user in search if user in friends]
