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
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi.security import OAuth2PasswordRequestForm

from server.api import dependencies as deps
from server.core import config, security, utils
from server.core.http_client import HttpClient
from server.models.users import User, UserRole
from server.repositories.users import UserRepository
from server.schemas.auth import PlexAuthorizeSignin, Token, TokenPayload
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
    user_repo: UserRepository = Depends(deps.get_repository(UserRepository)),
):
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
    payload = TokenPayload(sub=str(user.id))
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
        config.plex_token_url,
        queries_dict={
            "strong": "true",
            "X-Plex-Product": "Cheddarr",
            "X-Plex-Client-Identifier": config.plex_client_identifier,
        },
    )
    return request_pin_url


@router.post("/sign-in/plex/authorize")
async def authorize_signin_plex(request: Request, auth_data: PlexAuthorizeSignin):
    forward_url = re.sub(
        f"{config.api_prefix}/v[0-9]+", "", request.url_for("confirm_signin_plex")
    )
    token = security.generate_token(
        {
            "id": auth_data.key,
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
                "clientID": config.plex_client_identifier,
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
        status.HTTP_201_CREATED: {"model": UserSchema, "decription": "User created"},
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
    redirect_uri = token.get("redirect_uri", "")
    user_id = token.get("user_id", None)

    access_url = utils.make_url(
        config.plex_token_url + state,
        queries_dict={
            "code": code,
            "X-Plex-Client-Identifier": config.plex_client_identifier,
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
        if user_id is not None:
            user = await user_repo.find_by(id=user_id)
            if user is None:
                raise HTTPException(status.HTTP_404_NOT_FOUND, "No user with this id exist")
        else:
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

    # Update the Plex account with the API key (possibly different at each login)
    if user.plex_user_id is None:
        user.plex_user_id = plex_user_id
    if user.email is None:
        user.email = plex_email
    user.avatar = plex_avatar
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
