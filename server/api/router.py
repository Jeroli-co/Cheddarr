from fastapi import APIRouter

from .endpoints import auth, users, providers, search, requests

api_router = APIRouter()
api_router.include_router(auth.router, tags=["auth"])
api_router.include_router(users.users_router, prefix="/users", tags=["users"])
api_router.include_router(
    users.current_user_router, prefix="/user", tags=["current user"]
)
api_router.include_router(
    providers.base.providers_router, prefix="/providers", tags=["providers"]
)
api_router.include_router(search.router, prefix="/search", tags=["search"])
api_router.include_router(requests.router, prefix="/requests", tags=["requests"])
