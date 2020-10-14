from typing import List, Optional

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
    BackgroundTasks,
    Request,
)
from requests import Session

from server import models, schemas
from server.api import dependencies as deps
from server.core import utils
from server.core.config import settings

users_router = APIRouter()
current_user_router = APIRouter()


@current_user_router.get("", response_model=schemas.User)
async def get_current_user(current_user: models.User = Depends(deps.current_user)):
    return current_user


@users_router.get(
    "/{id:int}",
    dependencies=([Depends(deps.current_user)]),
    response_model=schemas.UserPublic,
)
async def get_user_by_id(id: int, db: Session = Depends(deps.db)):
    user = models.User.get(db, id=id)
    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No user with this id exists.")
    return user


@users_router.get(
    "/{username:str}",
    dependencies=([Depends(deps.current_user)]),
    response_model=schemas.UserPublic,
)
async def get_user_by_username(username: str, db: Session = Depends(deps.db)):
    user = models.User.get_by_username(db, username)
    if not user:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND, "No user with this username exists."
        )
    return user


@current_user_router.delete("")
@users_router.delete("/{id:int}")
async def delete_user(
    id: int = None,
    db: Session = Depends(deps.db),
    current_user: models.User = Depends(deps.current_user),
):
    user = current_user
    if id is not None:
        user = models.User.get(db, id=id)
        if not user:
            raise HTTPException(
                status.HTTP_404_NOT_FOUND, "The user with this id does not exist."
            )

        if current_user != user and not current_user.admin:
            raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Wrong password.")

    user.delete(db)
    return {"message": "User deleted."}


@current_user_router.patch("", response_model=schemas.User)
@users_router.patch("/{id:int}", response_model=schemas.User)
async def update_user(
    *,
    id: int = None,
    user_in: schemas.UserUpdate,
    request: Request,
    background_tasks: BackgroundTasks,
    db: Session = Depends(deps.db),
    current_user: models.User = Depends(deps.current_user),
):
    user = current_user
    if id is not None:
        user = models.User.get(db, id=id)
        if not user:
            raise HTTPException(
                status.HTTP_404_NOT_FOUND, "The user with this id does not exist."
            )
        if user != current_user and not current_user.admin:
            raise HTTPException(
                status.HTTP_403_FORBIDDEN, "Insufficient rights to edit the user."
            )

    if user_in.username is not None:
        if models.User.get_by_username(db, user_in.username):
            raise HTTPException(
                status.HTTP_409_CONFLICT, "This username is not available."
            )
        user = user.update(
            db,
            obj_in=dict(username=user_in.username),
            commit=False,
        )

    if user_in.password is not None:
        if not user_in.old_password:
            raise HTTPException(
                status.HTTP_400_BAD_REQUEST,
                "Missing old password to change to a new password.",
            )

        if not current_user.password == user_in.old_password:
            raise HTTPException(
                status.HTTP_401_UNAUTHORIZED, "The passwords don't match."
            )
        user = user.update(
            db,
            obj_in=dict(password=user_in.password),
            commit=False,
        )
        if settings.MAIL_ENABLED:
            background_tasks.add_task(
                utils.send_email,
                to_email=current_user.email,
                subject="Your password has been changed",
                html_template_name="email/change_password_notice.html",
            )

    if user_in.email is not None:
        if models.User.get_by_email(db, user_in.email):
            raise HTTPException(
                status.HTTP_409_CONFLICT, "This email is already taken."
            )
        if settings.MAIL_ENABLED:
            email_data = schemas.EmailConfirm(
                email=user_in.email, old_email=user.email
            ).dict()
            token = utils.generate_timed_token(email_data)
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
            user = user.update(
                db,
                obj_in=dict(email=user_in.email),
                commit=False,
            )
    user.save(db, commit=True)
    return user


@current_user_router.put("/password")
async def reset_password(
    *,
    email_data: schemas.PasswordResetCreate,
    request: Request,
    background_tasks: BackgroundTasks,
    db: Session = Depends(deps.db),
):
    email = email_data.email
    user = models.User.get_by_email(db, email_data.email)
    if not user:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND, "No user registered with this email."
        )
    token = utils.generate_timed_token(user.email)
    background_tasks.add_task(
        utils.send_email,
        to_email=email,
        subject="Reset your password",
        html_template_name="email/reset_password_instructions.html",
        environment=dict(
            reset_url=request.url_for("confirm_reset_password", token=token)
        ),
    )
    return {"message": "Reset instructions sent."}


@current_user_router.get("/password/{token}", status_code=status.HTTP_202_ACCEPTED)
@current_user_router.post("/password/{token}", status_code=status.HTTP_201_CREATED)
async def confirm_reset_password(
    *,
    password: schemas.PasswordResetConfirm,
    token: str,
    background_tasks: BackgroundTasks,
    db: Session = Depends(deps.db),
):
    try:
        email = utils.confirm_timed_token(token)
    except Exception:
        raise HTTPException(
            status.HTTP_410_GONE, "The reset link is invalid or has expired."
        )

    user = models.User.get_by_email(db, email)
    if not user:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND, "No user with with this email was found."
        )

    if password is not None:
        user.update(db, obj_in=dict(password=password))
        background_tasks.add_task(
            utils.send_email,
            to_email=user.email,
            subject="Your password has been reset",
            html_template_name="email/reset_password_notice.html",
        )
        return {"message": "Password reset."}

    return {"message": "Able to reset."}


@current_user_router.get(
    "/friends", response_model=List[schemas.UserPublic], tags=["friends"]
)
def get_friends(
    provider_type: Optional[models.ProviderType] = None,
    current_user: models.User = Depends(deps.current_user),
):
    friends = current_user.friends
    if provider_type is not None:
        friends.append(current_user)
        if provider_type == models.ProviderType.movie_provider:
            return [
                friend
                for friend in friends
                if friend.providers.filter_by(
                    provider_type=models.ProviderType.movie_provider, enabled=True
                )
            ]

        if provider_type == models.ProviderType.series_provider:
            return [
                friend
                for friend in friends
                if friend.providers.filter_by(
                    provider_type=models.ProviderType.series_provider, enabled=True
                )
            ]

    return friends


@current_user_router.get(
    "/friends/received", response_model=schemas.UserPublic, tags=["friends"]
)
def get_pending_received_friends(
    current_user: models.User = Depends(deps.current_user),
):
    return current_user.pending_received_friends


@current_user_router.get(
    "/friends/requested", response_model=schemas.UserPublic, tags=["friends"]
)
def get_pending_requested_friends(
    current_user: models.User = Depends(deps.current_user),
):
    return current_user.pending_requested_friends


@current_user_router.post(
    "/friends",
    response_model=schemas.UserPublic,
    status_code=status.HTTP_201_CREATED,
    tags=["friends"],
)
def add_friend(
    friend: schemas.FriendshipCreate,
    current_user: models.User = Depends(deps.current_user),
    db: Session = Depends(deps.db),
):
    friend = models.User.get_by_username_or_email(db, friend.username_or_email)
    if not friend or friend == current_user or not friend.confirmed:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "The user does not exist.")

    if current_user.is_friend(friend):
        raise HTTPException(status.HTTP_409_CONFLICT, "This user is already a friend.")

    friendship = models.Friendship(requesting_user=current_user, receiving_user=friend)
    current_user.requested_friends.append(friendship)
    current_user.save(db)

    return friendship.receiving_user


@current_user_router.patch(
    "/friends/{username}", response_model=schemas.UserPublic, tags=["friends"]
)
def accept_friend(
    username,
    current_user: models.User = Depends(deps.current_user),
    db=Depends(deps.db),
):
    friend = models.User.get_by_username(db, username)
    if not friend:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "The user does not exist.")

    friendship = models.Friendship.get_by_user_ids(db, current_user.id, friend.id)
    if not friendship:
        raise HTTPException(
            status.HTTP_403_FORBIDDEN, "This user is not in your friend list."
        )
    friendship.update(db, obj_in=dict(pending=False))
    return friend


@current_user_router.delete("/friends/{username}", tags=["friends"])
def remove_friend(
    username: str,
    current_user: models.User = Depends(deps.current_user),
    db: Session = Depends(deps.db),
):
    friend = models.User.get_by_username(db, username)
    if not friend:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "The user does not exist.")

    friendship = models.Friendship.get_by_user_ids(db, current_user.id, friend.id)
    if not friendship:
        raise HTTPException(
            status.HTTP_403_FORBIDDEN, "This user is not in your friend list."
        )

    friendship.delete(db)
    return {"message": "Friend removed."}
