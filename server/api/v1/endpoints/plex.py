from typing import List, Union

from fastapi import APIRouter, Depends, HTTPException, status

from server import models, schemas
from server.api import dependencies as deps
from server.helpers import plex
from server.repositories import PlexAccountRepository

router = APIRouter()


@router.get(
    "/servers",
    response_model=List[schemas.PlexServer],
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "No Plex account linked"},
    },
)
def get_plex_account_servers(
    current_user: models.User = Depends(deps.get_current_user),
    plex_account_repo: PlexAccountRepository = Depends(deps.get_repository(PlexAccountRepository)),
):
    plex_account = plex_account_repo.find_by(user_id=current_user.id)
    if plex_account is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No Plex account linked to the user.")
    servers = plex.get_plex_account_servers(plex_account.api_key)
    return servers
