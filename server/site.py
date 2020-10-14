from fastapi.routing import Mount
from fastapi.staticfiles import StaticFiles
from fastapi import FastAPI, HTTPException, Request, status
from fastapi.templating import Jinja2Templates
from starlette.responses import FileResponse

from server.core.config import settings


site_routes = [
    Mount("/images", StaticFiles(directory=settings.IMAGES_FOLDER), name="images"),
    Mount(
        "/static",
        StaticFiles(directory=settings.REACT_STATIC_FOLDER),
        name="static",
    ),
]
site = FastAPI(routes=site_routes)
site_templates = Jinja2Templates(settings.REACT_BUILD_FOLDER)


@site.get("/favicon.ico")
async def favicon():
    return FileResponse(settings.REACT_BUILD_FOLDER / "favicon.ico")


@site.get("/manifest.json")
async def manifest():
    return FileResponse(settings.REACT_BUILD_FOLDER / "manifest.json")


@site.get("{path:path}")
async def index(request: Request, path: str):
    if path.startswith(settings.API_PREFIX):
        raise HTTPException(status.HTTP_404_NOT_FOUND)
    return site_templates.TemplateResponse("index.html", {"request": request})
