from fastapi import APIRouter
from fastapi.params import Depends

from server import models
from server.api import dependencies as deps
from . import plex

providers_router = APIRouter()
providers_router.include_router(plex.router, tags=["plex"])


@providers_router.get("")
def get_user_providers(
    current_user: models.User = Depends(deps.current_user), **filters: dict
):
    return current_user.providers.filter_by(**filters).all()
