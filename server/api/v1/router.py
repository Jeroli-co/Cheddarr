from fastapi import APIRouter, FastAPI

from .endpoints import (
    auth,
    movies,
    notifications,
    requests,
    search,
    series,
    settings,
    system,
    users,
)

version = "v1"

router = APIRouter()
router.include_router(auth.router, tags=["auth"])
router.include_router(movies.router, prefix="/movies", tags=["movies"])
router.include_router(notifications.router, prefix="/notifications", tags=["notifications"])
router.include_router(requests.router, prefix="/requests", tags=["requests"])
router.include_router(search.router, prefix="/search", tags=["search"])
router.include_router(series.router, prefix="/series", tags=["series"])
router.include_router(
    settings.router,
    prefix="/settings",
    tags=["settings"],
)
router.include_router(system.router, prefix="/system", tags=["system"])
router.include_router(users.current_user_router, prefix="/user", tags=["current user"])
router.include_router(users.users_router, prefix="/users", tags=["users"])

application = FastAPI(title="Cheddarr", version=version)
application.include_router(router)
