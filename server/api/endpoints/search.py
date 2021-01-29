from fastapi import APIRouter, HTTPException, status

from server import schemas
from server.helpers import search

router = APIRouter()


@router.get(
    "",
    response_model=schemas.SearchResult,
    response_model_exclude_none=True,
)
def search_media(value, page=1):
    return search.search_tmdb_media(value, page)


@router.get(
    "/movies",
    response_model=schemas.SearchResult,
    response_model_exclude_none=True,
)
def search_movies(value, page=1):
    return search.search_tmdb_movies(value, page)


@router.get(
    "/series",
    response_model=schemas.SearchResult,
    response_model_exclude_none=True,
)
def search_series(value, page=1):
    return search.search_tmdb_series(value, page)


@router.get(
    "/movies/{provider_id}",
    response_model=schemas.Movie,
    response_model_exclude_none=True,
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "No movie found"},
    },
)
def find_movie(provider_id: int):
    """ Find a movie with  an external search provider id (TMDB) """
    movie = search.find_tmdb_movie(provider_id)
    if movie is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Movie not found.")
    return movie


@router.get(
    "/series/{provider_id}",
    response_model=schemas.Series,
    response_model_exclude_none=True,
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "No series found"},
    },
)
def find_series(provider_id: int):
    """ Find a TV series with an external search provider id (TVDB) """
    series = search.find_tmdb_series_by_tvdb_id(provider_id)
    if series is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Series not found.")
    return series


@router.get(
    "/series/{provider_id}/seasons/{season_number}",
    response_model=schemas.Season,
    response_model_exclude_none=True,
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "No season found"},
    },
)
def find_season(provider_id: int, season_number: int):
    """ Find a TV season with  an external search provider id (TVDB) and a season number """
    season = search.find_tmdb_season_by_tvdb_id(provider_id, season_number)
    if season is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Season not found.")
    return season


@router.get(
    "/series/{provider_id}/seasons/{season_number}/episodes/{episode_number}",
    response_model=schemas.Episode,
    response_model_exclude_none=True,
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "No episode found"},
    },
)
def find_episode(provider_id: int, season_number: int, episode_number: int):
    """ Find a TV episode with an external search provider id (TVDB), a season number and an episode number """
    episode = search.find_tmdb_episode_by_tvdb_id(
        provider_id, season_number, episode_number
    )
    if episode is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Episode not found.")
    return episode
