from fastapi import APIRouter, Depends, HTTPException, status

from server import schemas, models
from server.api import dependencies as deps
from server.helpers import search
from server.repositories import (
    EpisodeRepository,
    MediaRepository,
    ProviderSettingRepository,
    SeasonRepisitory,
)

router = APIRouter()


@router.get(
    "",
    response_model=schemas.SearchResult,
    response_model_exclude_none=True,
)
def search_media(
    value,
    page=1,
    media_repo: MediaRepository = Depends(deps.get_repository(MediaRepository)),
    provider_setting_repo: ProviderSettingRepository = Depends(
        deps.get_repository(ProviderSettingRepository)
    ),
):
    tmdb_media, total_pages, total_results = search.search_tmdb_media(value, page)
    for media in tmdb_media:
        media_info = media_repo.find_by(tmdb_id=media.tmdb_id)
        if media_info is not None:
            provider = provider_setting_repo.find_by(id=media_info.provider_setting_id)
            if provider.name == models.PlexSetting.__name__:
                media.plex_media_info = media_info
    search_result = schemas.TmdbSearchResult(
        results=tmdb_media, page=page, total_pages=total_pages, total_results=total_results
    )
    return search_result


@router.get(
    "/movies",
    response_model=schemas.SearchResult,
    response_model_exclude_none=True,
)
def search_movies(
    value,
    page=1,
    media_repo: MediaRepository = Depends(deps.get_repository(MediaRepository)),
    provider_setting_repo: ProviderSettingRepository = Depends(
        deps.get_repository(ProviderSettingRepository)
    ),
):
    tmdb_movies, total_pages, total_results = search.search_tmdb_movies(value, page)
    for movie in tmdb_movies:
        media_info = media_repo.find_by(tmdb_id=movie.tmdb_id)
        if media_info is not None:
            provider = provider_setting_repo.find_by(id=media_info.provider_setting_id)
            if provider.name == models.PlexSetting.__name__:
                movie.plex_media_info = media_info
    search_result = schemas.TmdbSearchResult(
        results=tmdb_movies, page=page, total_pages=total_pages, total_results=total_results
    )
    return search_result


@router.get(
    "/series",
    response_model=schemas.SearchResult,
    response_model_exclude_none=True,
)
def search_series(
    value,
    page=1,
    media_repo: MediaRepository = Depends(deps.get_repository(MediaRepository)),
    provider_setting_repo: ProviderSettingRepository = Depends(
        deps.get_repository(ProviderSettingRepository)
    ),
):
    tmdb_series, total_pages, total_results = search.search_tmdb_series(value, page)
    for series in tmdb_series:
        media_info = media_repo.find_by(tmdb_id=series.tmdb_id)
        if media_info is not None:
            provider = provider_setting_repo.find_by(id=media_info.provider_setting_id)
            if provider.name == models.PlexSetting.__name__:
                series.plex_media_info = media_info
    search_result = schemas.TmdbSearchResult(
        results=tmdb_series, page=page, total_pages=total_pages, total_results=total_results
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
    provider_id: int,
    media_repo: MediaRepository = Depends(deps.get_repository(MediaRepository)),
    provider_setting_repo: ProviderSettingRepository = Depends(
        deps.get_repository(ProviderSettingRepository)
    ),
):
    """ Find a movie with  an external search provider id (TMDB) """
    movie = search.find_tmdb_movie(provider_id)
    if movie is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Movie not found.")

    media_info = media_repo.find_by(tmdb_id=movie.tmdb_id)
    if media_info is not None:
        provider = provider_setting_repo.find_by(id=media_info.provider_setting_id)
        if provider.name == models.PlexSetting.__name__:
            movie.plex_media_info = media_info
    return movie


@router.get(
    "/series/{provider_id}",
    response_model=schemas.Series,
    response_model_exclude_none=True,
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "No series found"},
    },
)
def find_series(
    provider_id: int,
    media_repo: MediaRepository = Depends(deps.get_repository(MediaRepository)),
    provider_setting_repo: ProviderSettingRepository = Depends(
        deps.get_repository(ProviderSettingRepository)
    ),
):
    """ Find a TV series with an external search provider id (TVDB) """
    series = search.find_tmdb_series_by_tvdb_id(provider_id)
    if series is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Series not found.")

    media_info = media_repo.find_by(tmdb_id=series.tmdb_id)
    if media_info is not None:
        provider = provider_setting_repo.find_by(id=media_info.provider_setting_id)
        if provider.name == models.PlexSetting.__name__:
            series.plex_media_info = media_info
    return series


@router.get(
    "/series/{provider_id}/seasons/{season_number}",
    response_model=schemas.Season,
    response_model_exclude_none=True,
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "No season found"},
    },
)
def find_season(
    provider_id: int,
    season_number: int,
    season_repo: SeasonRepisitory = Depends(deps.get_repository(SeasonRepisitory)),
    provider_setting_repo: ProviderSettingRepository = Depends(
        deps.get_repository(ProviderSettingRepository)
    ),
):
    """ Find a TV season with  an external search provider id (TVDB) and a season number """
    season = search.find_tmdb_season_by_tvdb_id(provider_id, season_number)
    if season is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Season not found.")

    media_info = season_repo.find_by_tmdb_id_and_season_number(
        tmdb_id=provider_id, season_number=season_number
    )
    if media_info is not None:
        provider = provider_setting_repo.find_by(id=media_info.media.provider_setting_id)
        if provider.name == models.PlexSetting.__name__:
            season.plex_media_info = media_info
    return season


@router.get(
    "/series/{provider_id}/seasons/{season_number}/episodes/{episode_number}",
    response_model=schemas.Episode,
    response_model_exclude_none=True,
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "No episode found"},
    },
)
def find_episode(
    provider_id: int,
    season_number: int,
    episode_number: int,
    episode_repo: EpisodeRepository = Depends(deps.get_repository(EpisodeRepository)),
    provider_setting_repo: ProviderSettingRepository = Depends(
        deps.get_repository(ProviderSettingRepository)
    ),
):
    """ Find a TV episode with an external search provider id (TVDB), a season number and an episode number """
    episode = search.find_tmdb_episode_by_tvdb_id(provider_id, season_number, episode_number)
    if episode is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Episode not found.")

    media_info = episode_repo.find_by_tmdb_id_and_season_number_and_episode_number(
        tmdb_id=provider_id, season_number=season_number, episode_number=episode_number
    )
    if media_info is not None:
        provider = provider_setting_repo.find_by(id=media_info.media.provider_setting_id)
        if provider.name == models.PlexSetting.__name__:
            episode.plex_media_info = media_info
    return episode
