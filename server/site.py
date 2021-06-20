from fastapi import FastAPI, HTTPException, Request, status
from fastapi.responses import FileResponse
from fastapi.routing import Mount
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from server.core.config import get_config

site_routes = [
    Mount("/images", StaticFiles(directory=str(get_config().images_folder)), name="images"),
    Mount(
        "/static",
        StaticFiles(directory=str(get_config().react_static_folder)),
        name="static",
    ),
]
site = FastAPI(routes=site_routes, docs_url=None, redoc_url=None)
site_templates = Jinja2Templates(str(get_config().react_build_folder))


@site.get("/favicon.ico")
async def favicon():
    return FileResponse(str(get_config().react_build_folder / "favicon.ico"))


@site.get("/manifest.json")
async def manifest():
    return FileResponse(str(get_config().react_build_folder / "manifest.json"))


@site.get("{path:path}")
async def index(request: Request, path: str):
    if path.startswith(get_config().api_prefix):
        raise HTTPException(status.HTTP_404_NOT_FOUND)
    return site_templates.TemplateResponse("index.html", {"request": request})
