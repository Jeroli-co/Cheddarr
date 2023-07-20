from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from server.api.v1 import router
from server.core.config import get_config
from server.core.http_client import HttpClient
from server.core.scheduler import scheduler
from server.site import site


def setup_app() -> FastAPI:
    config = get_config()
    config.setup()

    application = FastAPI(
        title="Cheddarr",
        docs_url=None,
        redoc_url=None,
        on_startup=[on_start_up],
        on_shutdown=[on_shutdown],
    )
    application.mount(f"/api/{router.version}", router.application)
    application.mount("/", site)
    application.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in config.backend_cors_origin],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    from server.core.logger import Logger

    Logger.make_logger(config)

    from server import jobs  # noqa

    scheduler.start()

    return application


async def on_start_up() -> None:
    HttpClient.get_http_client()


async def on_shutdown() -> None:
    await HttpClient.close_http_client()


app = setup_app()
