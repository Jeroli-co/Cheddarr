from fastapi import APIRouter, FastAPI
from .endpoints import auth, settings, plex, requests, search, users, notifications

version = "v1"

router = APIRouter()
router.include_router(auth.router, tags=["auth"])
router.include_router(users.users_router, prefix="/users", tags=["users"])
router.include_router(users.current_user_router, prefix="/user", tags=["current user"])
router.include_router(
    notifications.router, prefix="/notifications", tags=["notifications"]
)
router.include_router(
    settings.router,
    prefix="/settings",
    tags=["settings"],
)
router.include_router(plex.router, prefix="/plex", tags=["plex"])
router.include_router(search.router, prefix="/search", tags=["search"])
router.include_router(requests.router, prefix="/requests", tags=["requests"])


application = FastAPI(title="Cheddarr", version=version)
application.include_router(router)
