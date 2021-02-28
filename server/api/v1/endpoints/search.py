from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status

from server import models, schemas
from server.api import dependencies as deps
from server.helpers import search
from server.repositories import (
    EpisodeRepository,
    MediaRepository,
    SeasonRepisitory,
)

router = APIRouter()


@router.get("", response_model=schemas.SearchResult, response_model_exclude_none=True)
def search_media(
    value,
    page=1,
    media_type: Optional[models.MediaType] = None,
    media_repo: MediaRepository = Depends(deps.get_repository(MediaRepository)),
):
    if media_type == models.MediaType.series:
        media_results, total_pages, total_results = search.search_tmdb_series(value, page)
    elif media_type == models.MediaType.movies:
        media_results, total_pages, total_results = search.search_tmdb_movies(value, page)
    else:
        media_results, total_pages, total_results = search.search_tmdb_media(value, page)

    for media in media_results:
        media_info = media_repo.find_by_any_external_id(
            external_ids=[media.tmdb_id, media.imdb_id, media.tvdb_id],
        )
        if media_info is not None:
            media.plex_media_info = [
                schemas.PlexMediaInfo(**server_media.as_dict())
                for server_media in media_info.server_media
            ]
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
):
    movie = search.find_tmdb_movie(tmdb_id)
    if movie is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Movie not found.")

    media_info = media_repo.find_by_any_external_id(
        external_ids=[movie.tmdb_id, movie.imdb_id, movie.tvdb_id],
    )
    if media_info is not None:
        movie.plex_media_info = [
            schemas.PlexMediaInfo(**server_media.as_dict())
            for server_media in media_info.server_media
        ]
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
):
    series = search.find_tmdb_series(media_id)
    if series is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Series not found.")

    media_info = media_repo.find_by_any_external_id(
        external_ids=[series.tmdb_id, series.imdb_id, series.tvdb_id],
    )
    if media_info is not None:
        series.plex_media_info = [
            schemas.PlexMediaInfo(**server_media.as_dict())
            for server_media in media_info.server_media
        ]
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
):
    season = search.find_tmdb_season(media_id, season_number)
    if season is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Season not found.")

    media_info = season_repo.find_by_any_external_id_and_season_number(
        external_ids=[season.tmdb_id, season.imdb_id, season.tvdb_id],
        season_number=season.season_number,
    )
    if media_info is not None:
        season.plex_media_info = [
            schemas.PlexMediaInfo(**server_media.as_dict())
            for server_media in media_info.server_media
        ]
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
):
    episode = search.find_tmdb_episode(media_id, season_number, episode_number)
    if episode is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Episode not found.")

    media_info = episode_repo.find_by_any_external_id_and_season_number_and_episode_number(
        external_ids=[episode.tmdb_id, episode.imdb_id, episode.tvdb_id],
        season_number=season_number,
        episode_number=episode_number,
    )
    if media_info is not None:
        episode.plex_media_info = [
            schemas.PlexMediaInfo(**server_media.as_dict())
            for server_media in media_info.server_media
        ]
    return episode.dict()
