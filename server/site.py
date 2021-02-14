from fastapi import FastAPI, HTTPException, Request, status
from fastapi.responses import FileResponse
from fastapi.routing import Mount
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from server.core.config import config

site_routes = [
    Mount("/images", StaticFiles(directory=str(config.IMAGES_FOLDER)), name="images"),
    Mount(
        "/static",
        StaticFiles(directory=str(config.REACT_STATIC_FOLDER)),
        name="static",
    ),
]
site = FastAPI(routes=site_routes, docs_url=None, redoc_url=None)
site_templates = Jinja2Templates(str(config.REACT_BUILD_FOLDER))


@site.get("/favicon.ico")
async def favicon():
    return FileResponse(str(config.REACT_BUILD_FOLDER / "favicon.ico"))


@site.get("/manifest.json")
async def manifest():
    return FileResponse(str(config.REACT_BUILD_FOLDER / "manifest.json"))


@site.get("{path:path}")
async def index(request: Request, path: str):
    if path.startswith(config.API_PREFIX):
        raise HTTPException(status.HTTP_404_NOT_FOUND)
    return site_templates.TemplateResponse("index.html", {"request": request})
