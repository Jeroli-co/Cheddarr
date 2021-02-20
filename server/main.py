import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from server.api.v1 import v1
from server.core import config, logger
from server.core.scheduler import scheduler
from server.site import site


def setup_app() -> FastAPI:
    application = FastAPI(title="Cheddarr", docs_url=None, redoc_url=None)
    application.mount(f"{config.API_PREFIX}/{v1.version}", v1.application)
    application.mount("/", site)
    application.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in config.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    config.setup()

    from server import jobs  # noqa

    scheduler.start()

    logger.log(logging.INFO, "Starting Cheddarr")
    return application


app = setup_app()
