from typing import Union
from urllib.parse import urlparse

from fastapi import APIRouter, Depends, HTTPException, status

from server import models, schemas
from server.api import dependencies as deps
from server.helpers import plex
from server.repositories import PlexAccountRepository

router = APIRouter()


@router.get(
    "/servers",
    response_model=list[schemas.PlexServerInfo],
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "No Plex account linked"},
    },
)
def get_plex_account_servers(
    current_user: models.User = Depends(deps.get_current_user),
    plex_account_repo: PlexAccountRepository = Depends(
        deps.get_repository(PlexAccountRepository)
    ),
):
    plex_account = plex_account_repo.find_by(user_id=current_user.id)
    if plex_account is None:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND, "No Plex account linked to the user."
        )
    servers = plex.get_plex_account_servers(plex_account.api_key)
    return servers


@router.get(
    "/servers/{server_name}",
    response_model=schemas.PlexServerOut,
    responses={
        status.HTTP_404_NOT_FOUND: {
            "description": "No Plex account linked or no server found"
        },
    },
)
def get_plex_account_server(
    server_name: str,
    current_user: models.User = Depends(deps.get_current_user),
    plex_account_repo: PlexAccountRepository = Depends(
        deps.get_repository(PlexAccountRepository)
    ),
):
    plex_account = plex_account_repo.find_by(user_id=current_user.id)
    if plex_account is None:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND, "No Plex account linked to the user."
        )
    server = plex.get_plex_account_server(plex_account.api_key, server_name)
    if server is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Plex server not found.")
    server_in = schemas.PlexServerIn.from_orm(server)
    url = urlparse(server_in.base_url)
    return schemas.PlexServerOut(
        server_name=server_in.server_name,
        server_id=server_in.server_id,
        host=url.hostname,
        port=url.port,
        ssl=True if url.scheme == "https" else False,
        api_key=server_in.api_key,
    )


@router.get(
    "/{config_id}/movies/recent",
    response_model=list[schemas.PlexMovie],
    response_model_by_alias=False,
    response_model_exclude={"server"},
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "No Plex configuration"},
        status.HTTP_503_SERVICE_UNAVAILABLE: {
            "description": "Plex server connection error"
        },
    },
)
def get_plex_recent_movies(
    config_id: str,
    plex_configs: list[models.PlexConfig] = Depends(deps.get_current_user_plex_configs),
):
    config = next((config for config in plex_configs if config.id == config_id), None)
    if config is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Plex configuration not found.")
    plex_server = plex.get_server(
        base_url=config.host, port=config.port, ssl=config.ssl, api_key=config.api_key
    )
    if plex_server is None:
        raise HTTPException(
            status.HTTP_503_SERVICE_UNAVAILABLE, "Could not connect to the Plex server."
        )
    movie_sections = plex.library_sections(plex_server, section_type="movies")
    recent_movies = [
        movie
        for section in movie_sections
        for movie in section.recentlyAdded(maxresults=20)
    ]
    return recent_movies


@router.get(
    "/{config_id}/movies/{movie_id}",
    response_model=schemas.PlexMovie,
    response_model_by_alias=False,
    response_model_exclude={"server"},
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "No Plex configuration"},
        status.HTTP_503_SERVICE_UNAVAILABLE: {
            "description": "Plex server connection error"
        },
    },
)
def get_plex_movie(
    config_id: str,
    movie_id: int,
    plex_configs: list[models.PlexConfig] = Depends(deps.get_current_user_plex_configs),
):
    config = next((config for config in plex_configs if config.id == config_id), None)
    if config is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Plex configuration not found.")
    plex_server = plex.get_server(
        base_url=config.host, port=config.port, ssl=config.ssl, api_key=config.api_key
    )
    if plex_server is None:
        raise HTTPException(
            status.HTTP_503_SERVICE_UNAVAILABLE, "Could not connect to the Plex server."
        )
    movie = plex_server.fetchItem(ekey=int(movie_id))
    movie.reload()
    return movie


@router.get(
    "/{config_id}/series/recent",
    response_model=list[schemas.PlexEpisode],
    response_model_by_alias=False,
    response_model_exclude={"server"},
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "No Plex configuration"},
        status.HTTP_503_SERVICE_UNAVAILABLE: {
            "description": "Plex server connection error"
        },
    },
)
def get_plex_recent_series(
    config_id: str,
    plex_configs: list[models.PlexConfig] = Depends(deps.get_current_user_plex_configs),
):
    config = next((config for config in plex_configs if config.id == config_id), None)
    if config is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Plex configuration not found.")
    plex_server = plex.get_server(
        base_url=config.host, port=config.port, ssl=config.ssl, api_key=config.api_key
    )
    if plex_server is None:
        raise HTTPException(
            status.HTTP_503_SERVICE_UNAVAILABLE, "Could not connect to the Plex server."
        )
    series_section = plex.library_sections(plex_server, section_type="series")
    recent_series = [
        series
        for section in series_section
        for series in section.recentlyAdded(maxresults=20)
    ]
    recent_series.sort(key=lambda s: s.addedAt, reverse=True)
    return recent_series

@router.get(
    "/{config_id}/series/{series_id}",
    response_model=schemas.PlexSeries,
    response_model_by_alias=False,
    response_model_exclude={"server"},
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "No Plex configuration"},
        status.HTTP_503_SERVICE_UNAVAILABLE: {
            "description": "Plex server connection error"
        },
    },
)
def get_plex_series(
    config_id: str,
    series_id: int,
    plex_configs: list[models.PlexConfig] = Depends(deps.get_current_user_plex_configs),
):
    config = next((config for config in plex_configs if config.id == config_id), None)
    if config is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Plex configuration not found.")
    plex_server = plex.get_server(
        base_url=config.host, port=config.port, ssl=config.ssl, api_key=config.api_key
    )
    if plex_server is None:
        raise HTTPException(
            status.HTTP_503_SERVICE_UNAVAILABLE, "Could not connect to the Plex server."
        )
    series = plex_server.fetchItem(ekey=series_id)
    series.reload()
    return series


@router.get(
    "/{config_id}/seasons/{season_id}",
    response_model=schemas.PlexSeason,
    response_model_by_alias=False,
    response_model_exclude={"server"},
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "No Plex configuration"},
        status.HTTP_503_SERVICE_UNAVAILABLE: {
            "description": "Plex server connection error"
        },
    },
)
def get_plex_season(
    config_id: str,
    season_id: int,
    plex_configs: list[models.PlexConfig] = Depends(deps.get_current_user_plex_configs),
):
    config = next((config for config in plex_configs if config.id == config_id), None)
    if config is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Plex configuration not found.")
    plex_server = plex.get_server(
        base_url=config.host, port=config.port, ssl=config.ssl, api_key=config.api_key
    )
    if plex_server is None:
        raise HTTPException(
            status.HTTP_503_SERVICE_UNAVAILABLE, "Could not connect to the Plex server."
        )
    season = plex_server.fetchItem(ekey=season_id)
    season.reload()
    return season


@router.get(
    "/{config_id}/episodes/{episode_id}",
    response_model=schemas.PlexEpisode,
    response_model_by_alias=False,
    response_model_exclude={"server"},
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "No Plex config or server"},
        status.HTTP_503_SERVICE_UNAVAILABLE: {
            "description": "Plex server connection error"
        },
    },
)
def get_plex_episode(
    config_id: str,
    episode_id: int,
    plex_configs: list[models.PlexConfig] = Depends(deps.get_current_user_plex_configs),
):
    config = next((config for config in plex_configs if config.id == config_id), None)
    if config is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Plex configuration not found.")
    plex_server = plex.get_server(
        base_url=config.host, port=config.port, ssl=config.ssl, api_key=config.api_key
    )
    if plex_server is None:
        raise HTTPException(
            status.HTTP_503_SERVICE_UNAVAILABLE, "Could not connect to the Plex server."
        )
    episode = plex_server.fetchItem(ekey=episode_id)
    episode.reload()
    return episode


@router.get(
    "/{config_id}/on-deck",
    response_model=list[Union[schemas.PlexMovie, schemas.PlexEpisode]],
    response_model_by_alias=False,
    response_model_exclude={"server"},
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "No Plex configuration"},
        status.HTTP_503_SERVICE_UNAVAILABLE: {
            "description": "Plex server connection error"
        },
    },
)
def get_plex_on_deck(
    config_id: str,
    plex_configs: list[models.PlexConfig] = Depends(deps.get_current_user_plex_configs),
):
    config = next((config for config in plex_configs if config.id == config_id), None)
    if config is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Plex configuration not found.")
    plex_server = plex.get_server(
        base_url=config.host, port=config.port, ssl=config.ssl, api_key=config.api_key
    )
    if plex_server is None:
        raise HTTPException(
            status.HTTP_503_SERVICE_UNAVAILABLE, "Could not connect to the Plex server."
        )
    on_deck = plex_server.library.onDeck()
    return on_deck


@router.get(
    "/{config_id}/search",
    response_model=list[schemas.MediaSearchResultSchema],
    response_model_by_alias=False,
    response_model_exclude={"server"},
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "No Plex configuration"},
        status.HTTP_503_SERVICE_UNAVAILABLE: {
            "description": "Plex server connection error"
        },
    },
)
def search_plex_media(
    config_id: str,
    value: str,
    section: models.MediaType = None,
    plex_configs: list[models.PlexConfig] = Depends(deps.get_current_user_plex_configs),
):
    config = next((config for config in plex_configs if config.id == config_id), None)
    if config is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Plex configuration not found.")
    plex_server = plex.get_server(
        base_url=config.host, port=config.port, ssl=config.ssl, api_key=config.api_key
    )
    if plex_server is None:
        raise HTTPException(
            status.HTTP_503_SERVICE_UNAVAILABLE, "Could not connect to the Plex server."
        )
    result = plex.search(plex_server, section_type=section, title=value)
    return result
