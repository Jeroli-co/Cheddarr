from fastapi import APIRouter

from .endpoints import auth, users, configuration, search, requests, plex

router = APIRouter()
router.include_router(auth.router, tags=["auth"])
router.include_router(users.users_router, prefix="/users", tags=["users"])
router.include_router(users.current_user_router, prefix="/user", tags=["current user"])
router.include_router(
    configuration.router,
    prefix="/configuration",
    tags=["configuration"],
)
router.include_router(plex.router, prefix="/plex", tags=["plex"])
router.include_router(search.router, prefix="/search", tags=["search"])
router.include_router(requests.router, prefix="/requests", tags=["requests"])
