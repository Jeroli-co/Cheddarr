from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from server.api.router import api_router
from server.core.config import settings
from server.site import site


def setup_app() -> FastAPI:

    application = FastAPI(
        title=settings.APP_NAME,
        version=settings.API_VERSION,
        openapi_url=settings.API_PREFIX,
        docs_url=settings.API_PREFIX + "/docs",
        redoc_url=settings.API_PREFIX + "/redoc",
    )
    application.include_router(api_router, prefix=settings.API_PREFIX)
    application.mount("/", site)
    application.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    return application


app = setup_app()
