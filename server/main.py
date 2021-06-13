from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from server.api.v1 import router
from server.core import config, scheduler
from server.core.http_client import HttpClient
from server.core.logger import Logger
from server.site import site


def setup_app() -> FastAPI:
    application = FastAPI(
        title="Cheddarr",
        docs_url=None,
        redoc_url=None,
        on_startup=[on_start_up],
        on_shutdown=[on_shutdown],
    )
    application.mount(f"{config.api_prefix}/{router.version}", router.application)
    application.mount("/", site)
    application.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in config.backend_cors_origin],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    application.logger = Logger.make_logger()

    from server import jobs  # noqa

    scheduler.start()

    return application


async def on_start_up() -> None:
    HttpClient.get_http_client()


async def on_shutdown() -> None:
    await HttpClient.close_http_client()


app = setup_app()
