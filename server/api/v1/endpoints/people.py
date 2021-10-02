from fastapi import APIRouter, Depends, HTTPException, status

from server.api import dependencies as deps
from server.schemas.media import Person
from server.services import tmdb

router = APIRouter()


@router.get(
    "/{tmdb_person_id:int}",
    dependencies=[Depends(deps.get_current_user)],
    response_model=Person,
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "Person not found"},
    },
)
async def get_person(tmdb_person_id):
    person = await tmdb.get_tmdb_person(tmdb_person_id)
    if person is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Person not found.")
    return person
