from typing import Any

from fastapi import FastAPI, HTTPException, Request, status
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from server.core.config import get_config

site = FastAPI(docs_url=None, redoc_url=None)
#site.mount("/images", StaticFiles(directory=str(get_config().react_build_folder)), name="images")
site.mount(
    "/static",
    StaticFiles(directory=str(get_config().react_static_folder), check_dir=False),
    name="static",
)
site_templates = Jinja2Templates(str(get_config().react_build_folder))


@site.get("/favicon.ico")
async def favicon() -> FileResponse:
    return FileResponse(str(get_config().react_build_folder / "favicon.ico"))


@site.get("/manifest.json")
async def manifest() -> FileResponse:
    return FileResponse(str(get_config().react_build_folder / "manifest.json"))


@site.get("{path:path}")
async def index(request: Request, path: str) -> Any:
    if path.startswith("/api"):
        raise HTTPException(status.HTTP_404_NOT_FOUND)
    return site_templates.TemplateResponse("index.html", {"request": request})
