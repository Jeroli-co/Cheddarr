from typing import List

from fastapi import APIRouter, Depends, HTTPException
from pydantic import parse_obj_as
from starlette import status

from server.api import dependencies as deps
from server.models.media import MediaType
from server.repositories.media import (
    EpisodeRepository,
    MediaRepository,
    SeasonRepository,
)
from server.repositories.requests import MediaRequestRepository
from server.schemas.external_services import PlexMediaInfo
from server.schemas.media import EpisodeSchema, SeasonSchema, SeriesSchema
from server.schemas.requests import MovieRequestSchema
from server.schemas.search import SearchResult
from server.services import tmdb

router = APIRouter()


@router.get(
    "/{tmdb_id:int}",
    response_model=SeriesSchema,
    response_model_exclude_none=True,
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "No series found"},
    },
)
def get_series(
    tmdb_id: int,
    media_repo: MediaRepository = Depends(deps.get_repository(MediaRepository)),
    season_repo: SeasonRepository = Depends(deps.get_repository(SeasonRepository)),
    media_request_repo: MediaRequestRepository = Depends(
        deps.get_repository(MediaRequestRepository)
    ),
):
    series = tmdb.get_tmdb_series(tmdb_id)
    if series is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Series not found.")

    db_media = media_repo.find_by_any_external_id(
        external_ids=[series.tmdb_id, series.imdb_id, series.tvdb_id],
    )
    if db_media is not None:
        series.plex_media_info = [
            PlexMediaInfo(**media_info.as_dict()) for media_info in db_media.server_media
        ]
        db_seasons = season_repo.find_all_by(series_id=db_media.id)
        if db_seasons is not None:
            for season in series.seasons:
                season_info = next(
                    (s for s in db_seasons if s.season_number == season.season_number), None
                )
                if season_info is not None:
                    season.plex_media_info = [
                        PlexMediaInfo(**s.as_dict()) for s in season_info.server_seasons
                    ]
        series.requests = parse_obj_as(
            List[MovieRequestSchema], media_request_repo.find_all_by_tmdb_id(tmdb_id=tmdb_id)
        )

    return series.dict()


@router.get(
    "/{tmdb_id:int}/seasons/{season_number}",
    response_model=SeasonSchema,
    response_model_exclude_none=True,
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "No season found"},
    },
)
def get_season(
    tmdb_id: int,
    season_number: int,
    season_repo: SeasonRepository = Depends(deps.get_repository(SeasonRepository)),
    episode_repo: EpisodeRepository = Depends(deps.get_repository(EpisodeRepository)),
):
    season = tmdb.get_tmdb_season(tmdb_id, season_number)
    if season is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Season not found.")

    db_season = season_repo.find_by_any_external_id_and_season_number(
        external_ids=[tmdb_id],
        season_number=season.season_number,
    )
    if db_season is not None:
        season.plex_media_info = [
            PlexMediaInfo(**server_media.as_dict()) for server_media in db_season.server_seasons
        ]
        db_episodes = episode_repo.find_all_by(season_id=db_season.id)
        if db_episodes is not None:
            for episode in season.episodes:
                episode_info = next(
                    (e for e in db_episodes if e.episode_number == episode.episode_number), None
                )
                if episode_info is not None:
                    episode.plex_media_info = [
                        PlexMediaInfo(**s.as_dict()) for s in episode_info.server_episodes
                    ]
    return season.dict()


@router.get(
    "/{tmdb_id:int}/seasons/{season_number}/episodes/{episode_number}",
    response_model=EpisodeSchema,
    response_model_exclude_none=True,
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "No episode found"},
    },
)
def get_episode(
    tmdb_id: int,
    season_number: int,
    episode_number: int,
    episode_repo: EpisodeRepository = Depends(deps.get_repository(EpisodeRepository)),
):
    episode = tmdb.get_tmdb_episode(tmdb_id, season_number, episode_number)
    if episode is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Episode not found.")

    db_episode = episode_repo.find_by_any_external_id_and_season_number_and_episode_number(
        external_ids=[tmdb_id],
        season_number=season_number,
        episode_number=episode_number,
    )
    if db_episode is not None:
        episode.plex_media_info = [
            PlexMediaInfo(**server_media.as_dict()) for server_media in db_episode.server_episodes
        ]
    return episode.dict()


@router.get(
    "/recent",
    dependencies=[Depends(deps.get_current_user)],
    response_model=List[SeriesSchema],
)
def get_recent_series(
    media_repo: MediaRepository = Depends(deps.get_repository(MediaRepository)),
):

    db_recent_series = media_repo.find_all_recently_added(media_type=MediaType.series)
    recent_series = []
    for series in db_recent_series:
        tmdb_series = tmdb.get_tmdb_series(series.tmdb_id)
        tmdb_series.plex_media_info = series.server_media
        recent_series.append(tmdb_series.dict())

    return recent_series


@router.get("/popular", response_model=SearchResult, response_model_exclude_none=True)
def get_popular_series(
    page: int = 1, media_repo: MediaRepository = Depends(deps.get_repository(MediaRepository))
):
    popular_series, total_pages, total_results = tmdb.get_tmdb_popular_series(page=page)
    for movie in popular_series:
        set_movie_db_info(movie, media_repo)

    search_result = SearchResult(
        results=[m.dict() for m in popular_series],
        page=page,
        total_pages=total_pages,
        total_results=total_results,
    )

    return search_result


@router.get("/upcoming", response_model=SearchResult, response_model_exclude_none=True)
def get_upcoming_series(
    page: int = 1, media_repo: MediaRepository = Depends(deps.get_repository(MediaRepository))
):
    upcoming_series, total_pages, total_results = tmdb.get_tmdb_upcoming_series(page=page)
    for movie in upcoming_series:
        set_movie_db_info(movie, media_repo)

    search_result = SearchResult(
        results=[m.dict() for m in upcoming_series],
        page=page,
        total_pages=total_pages,
        total_results=total_results,
    )

    return search_result


@router.get(
    "/{tmdb_id:int}/similar", response_model=SearchResult, response_model_exclude_none=True
)
def get_similar_series(
    tmdb_id: int,
    page: int = 1,
    media_repo: MediaRepository = Depends(deps.get_repository(MediaRepository)),
):
    similar_series, total_pages, total_results = tmdb.get_tmdb_similar_series(
        tmdb_id=tmdb_id, page=page
    )
    for movie in similar_series:
        set_movie_db_info(movie, media_repo)

    search_result = SearchResult(
        results=[m.dict() for m in similar_series],
        page=page,
        total_pages=total_pages,
        total_results=total_results,
    )

    return search_result


@router.get(
    "/{tmdb_id:int}/recommended", response_model=SearchResult, response_model_exclude_none=True
)
def get_recommended_series(
    tmdb_id: int,
    page: int = 1,
    media_repo: MediaRepository = Depends(deps.get_repository(MediaRepository)),
):
    recommended_series, total_pages, total_results = tmdb.get_tmdb_recommended_series(
        tmdb_id=tmdb_id, page=page
    )
    for movie in recommended_series:
        set_movie_db_info(movie, media_repo)

    search_result = SearchResult(
        results=[m.dict() for m in recommended_series],
        page=page,
        total_pages=total_pages,
        total_results=total_results,
    )

    return search_result
