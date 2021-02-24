from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status

from server import schemas, models
from server.api import dependencies as deps
from server.helpers import search
from server.repositories import (
    EpisodeRepository,
    MediaRepository,
    ExternalServiceSettingRepository,
    SeasonRepisitory,
)

router = APIRouter()


@router.get("", response_model=schemas.SearchResult, response_model_exclude_none=True)
def search_media(
    value,
    page=1,
    media_type: Optional[models.MediaType] = None,
    media_repo: MediaRepository = Depends(deps.get_repository(MediaRepository)),
    external_service_repo: ExternalServiceSettingRepository = Depends(
        deps.get_repository(ExternalServiceSettingRepository)
    ),
):
    if media_type == models.MediaType.series:
        media_results, total_pages, total_results = search.search_tmdb_series(value, page)
    elif media_type == models.MediaType.movies:
        media_results, total_pages, total_results = search.search_tmdb_movies(value, page)
    else:
        media_results, total_pages, total_results = search.search_tmdb_media(value, page)

    for media in media_results:
        media_info = media_repo.find_by(tmdb_id=media.tmdb_id)
        if media_info is not None:
            server = external_service_repo.find_media_server_by(id=media_info.setting_id)
            if server.name == models.PlexSetting.__name__:
                media.plex_media_info = schemas.PlexMediaInfo(
                    **media_info.as_dict(), server_id=media_info.setting_id
                )
    search_result = schemas.SearchResult(
        results=[m.dict(by_alias=False) for m in media_results],
        page=page,
        total_pages=total_pages,
        total_results=total_results,
    )
    return search_result


@router.get(
    "/movies/{provider_id}",
    response_model=schemas.Movie,
    response_model_exclude_none=True,
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "No movie found"},
    },
)
def find_movie(
    tmdb_id: int,
    media_repo: MediaRepository = Depends(deps.get_repository(MediaRepository)),
    external_service_repo: ExternalServiceSettingRepository = Depends(
        deps.get_repository(ExternalServiceSettingRepository)
    ),
):
    movie = search.find_tmdb_movie(tmdb_id)
    if movie is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Movie not found.")

    media_info = media_repo.find_by(tmdb_id=movie.tmdb_id)
    if media_info is not None:
        server = external_service_repo.find_media_server_by(id=media_info.setting_id)
        if server.name == models.PlexSetting.__name__:
            movie.plex_media_info = schemas.PlexMediaInfo(
                **media_info.as_dict(), server_id=media_info.setting_id
            )
    return movie.dict()


@router.get(
    "/series/{media_id}",
    response_model=schemas.Series,
    response_model_exclude_none=True,
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "No series found"},
    },
)
def find_series(
    media_id: int,
    media_repo: MediaRepository = Depends(deps.get_repository(MediaRepository)),
    external_service_repo: ExternalServiceSettingRepository = Depends(
        deps.get_repository(ExternalServiceSettingRepository)
    ),
):
    series = search.find_tmdb_series(media_id)
    if series is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Series not found.")

    media_info = media_repo.find_by(tmdb_id=series.tmdb_id)
    if media_info is not None:
        server = external_service_repo.find_media_server_by(id=media_info.setting_id)
        if server.name == models.PlexSetting.__name__:
            series.plex_media_info = schemas.PlexMediaInfo(
                **media_info.as_dict(), server_id=media_info.setting_id
            )
    return series.dict()


@router.get(
    "/series/{media_id}/seasons/{season_number}",
    response_model=schemas.Season,
    response_model_exclude_none=True,
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "No season found"},
    },
)
def find_season(
    media_id: int,
    season_number: int,
    season_repo: SeasonRepisitory = Depends(deps.get_repository(SeasonRepisitory)),
    external_service_repo: ExternalServiceSettingRepository = Depends(
        deps.get_repository(ExternalServiceSettingRepository)
    ),
):
    season = search.find_tmdb_season(media_id, season_number)
    if season is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Season not found.")

    media_info = season_repo.find_by_tmdb_id_and_season_number(
        tmdb_id=media_id, season_number=season_number
    )
    if media_info is not None:
        server = external_service_repo.find_media_server_by(id=media_info.media.setting_id)
        if server.name == models.PlexSetting.__name__:
            season.plex_media_info = schemas.PlexMediaInfo(
                **media_info.as_dict(), server_id=media_info.media.setting_id
            )
    return season.dict()


@router.get(
    "/series/{media_id}/seasons/{season_number}/episodes/{episode_number}",
    response_model=schemas.Episode,
    response_model_exclude_none=True,
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "No episode found"},
    },
)
def find_episode(
    media_id: int,
    season_number: int,
    episode_number: int,
    episode_repo: EpisodeRepository = Depends(deps.get_repository(EpisodeRepository)),
    external_service_repo: ExternalServiceSettingRepository = Depends(
        deps.get_repository(ExternalServiceSettingRepository)
    ),
):
    episode = search.find_tmdb_episode(media_id, season_number, episode_number)
    if episode is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Episode not found.")

    media_info = episode_repo.find_by_tmdb_id_and_season_number_and_episode_number(
        tmdb_id=media_id, season_number=season_number, episode_number=episode_number
    )
    if media_info is not None:
        server = external_service_repo.find_media_server_by(id=media_info.season.media.setting_id)
        if server.name == models.PlexSetting.__name__:
            episode.plex_media_info = schemas.PlexMediaInfo(
                **media_info.as_dict(), server_id=media_info.season.media.setting_id
            )
    return episode.dict()
