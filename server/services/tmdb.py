import re
from typing import List, Optional, Union

import tmdbsimple as tmdb
from asgiref.sync import sync_to_async

from server.core.config import get_config
from server.models.media import MediaType, SeriesType
from server.schemas.media import (
    EpisodeSchema,
    MovieSchema,
    SeasonSchema,
    SeriesSchema,
    TmdbEpisode,
    TmdbMovie,
    TmdbSeason,
    TmdbSeries,
)

tmdb.API_KEY = get_config().tmdb_api_key


async def search_tmdb_media(
    term: str, page: int
) -> (List[Union[MovieSchema, SeriesSchema]], int, int):
    search = await sync_to_async(tmdb.Search().multi)(
        query=term, page=page, append_to_response="external_ids"
    )
    results = []
    for media in search["results"]:
        if media["media_type"] == "tv":
            del media["media_type"]
            parsed_media = SeriesSchema(**TmdbSeries.parse_obj(media).dict())
        elif media["media_type"] == "movie":
            del media["media_type"]
            parsed_media = MovieSchema(**TmdbMovie.parse_obj(media).dict())
        else:
            continue
        results.append(parsed_media)
    return results, search["total_pages"], search["total_results"]


async def search_tmdb_movies(term: str, page: int) -> (List[MovieSchema], int, int):
    search = await sync_to_async(tmdb.Search().movie)(query=term, page=page)
    results = []
    for movie in search["results"]:
        parsed_movie = MovieSchema(**TmdbMovie.parse_obj(movie).dict())
        results.append(parsed_movie)
    return results, search["total_pages"], search["total_results"]


async def search_tmdb_series(term: str, page: int) -> (List[SeriesSchema], int, int):
    search = await sync_to_async(tmdb.Search().tv)(query=term, page=page)
    results = []
    for series in search["results"]:
        parsed_media = SeriesSchema(**TmdbSeries.parse_obj(series).dict())
        results.append(parsed_media)
    return results, search["total_pages"], search["total_results"]


async def get_tmdb_movie(tmdb_id: int) -> Optional[MovieSchema]:
    try:
        movie = await sync_to_async(tmdb.Movies(tmdb_id).info)(
            append_to_response="external_ids,credits,videos"
        )
    except Exception:
        return None
    set_tmdb_movie_info(movie)
    return MovieSchema(**TmdbMovie.parse_obj(movie).dict())


async def get_tmdb_series(tmdb_id: int) -> Optional[SeriesSchema]:
    try:
        series = await sync_to_async(tmdb.TV(tmdb_id).info)(
            append_to_response="external_ids,aggregate_credits,videos"
        )
    except Exception:
        return None
    set_tmdb_series_info(series)
    return SeriesSchema(**TmdbSeries.parse_obj(series).dict())


async def get_tmdb_season(tmdb_id: int, season_number: int) -> Optional[SeasonSchema]:
    try:
        season = await sync_to_async(tmdb.TV_Seasons(tmdb_id, season_number).info)(
            append_to_response="external_ids,credits"
        )
    except Exception:
        return None
    return SeasonSchema(**TmdbSeason.parse_obj(season).dict())


async def get_tmdb_episode(
    tmdb_id: int, season_number: int, episode_number: int
) -> Optional[EpisodeSchema]:
    try:
        episode = await sync_to_async(
            tmdb.TV_Episodes(tmdb_id, season_number, episode_number).info
        )(append_to_response="external_ids,credits")
    except Exception:
        return None
    return EpisodeSchema(**TmdbEpisode.parse_obj(episode).dict())


async def find_tmdb_id_from_external_id(imdb_id=None, tvdb_id=None) -> int:
    find = {}
    if not find and imdb_id is not None:
        find = await sync_to_async(tmdb.Find(imdb_id).info)(external_source="imdb_id")
    elif not find and tvdb_id is not None:
        find = await sync_to_async(tmdb.Find(tvdb_id).info)(external_source="tvdb_id")
    tmdb_media = next((m[0] for m in find.values() if m), {})
    return tmdb_media.get("id")


async def find_external_ids_from_tmdb_id(tmdb_id: int) -> dict:
    return await sync_to_async(tmdb.TV(tmdb_id).external_ids)()


async def get_tmdb_popular_movies(page: int = 1) -> (List[MovieSchema], int, int):
    search = await sync_to_async(tmdb.Movies().popular)(page=page)
    results = []

    for movie in search["results"]:
        set_tmdb_movie_info(movie)
        parsed_movie = MovieSchema(**TmdbMovie.parse_obj(movie).dict())
        results.append(parsed_movie)
    return results, search["total_pages"], search["total_results"]


async def get_tmdb_upcoming_movies(page: int = 1) -> (List[MovieSchema], int, int):
    search = await sync_to_async(tmdb.Movies().upcoming)(page=page)
    results = []

    for movie in search["results"]:
        set_tmdb_movie_info(movie)
        parsed_movie = MovieSchema(**TmdbMovie.parse_obj(movie).dict())
        results.append(parsed_movie)
    return results, search["total_pages"], search["total_results"]


async def get_tmdb_similar_movies(tmdb_id: int, page: int = 1) -> (List[MovieSchema], int, int):
    search = await sync_to_async(tmdb.Movies(tmdb_id).similar_movies)(page=page)
    results = []

    for movie in search["results"]:
        set_tmdb_movie_info(movie)
        parsed_movie = MovieSchema(**TmdbMovie.parse_obj(movie).dict())
        results.append(parsed_movie)
    return results, search["total_pages"], search["total_results"]


async def get_tmdb_recommended_movies(
    tmdb_id: int, page: int = 1
) -> (List[MovieSchema], int, int):
    search = await sync_to_async(tmdb.Movies(tmdb_id).recommendations)(page=page)
    results = []

    for movie in search["results"]:
        set_tmdb_movie_info(movie)
        parsed_movie = MovieSchema(**TmdbMovie.parse_obj(movie).dict())
        results.append(parsed_movie)
    return results, search["total_pages"], search["total_results"]


async def get_tmdb_popular_series(page: int = 1) -> (List[SeriesSchema], int, int):
    search = await sync_to_async(tmdb.TV().popular)(page=page)
    results = []

    for series in search["results"]:
        set_tmdb_series_info(series)
        parsed_series = SeriesSchema(**TmdbSeries.parse_obj(series).dict())
        results.append(parsed_series)
    return results, search["total_pages"], search["total_results"]


async def get_tmdb_similar_series(tmdb_id: int, page: int = 1) -> (List[SeriesSchema], int, int):
    search = await sync_to_async(tmdb.TV(tmdb_id).similar)(page=page)
    results = []

    for series in search["results"]:
        set_tmdb_series_info(series)
        parsed_series = SeriesSchema(**TmdbSeries.parse_obj(series).dict())
        results.append(parsed_series)
    return results, search["total_pages"], search["total_results"]


async def get_tmdb_recommended_series(
    tmdb_id: int, page: int = 1
) -> (List[SeriesSchema], int, int):
    search = await sync_to_async(tmdb.TV(tmdb_id).recommendations)(page=page)
    results = []

    for series in search["results"]:
        set_tmdb_series_info(series)
        parsed_series = SeriesSchema(**TmdbSeries.parse_obj(series).dict())
        results.append(parsed_series)
    return results, search["total_pages"], search["total_results"]


def set_tmdb_movie_info(movie: dict):
    movie["media_type"] = MediaType.movie
    genres = [genre["name"] for genre in movie.get("genres", [])]
    movie["genres"] = genres
    movie["videos"] = [
        video
        for video in movie.get("videos", {}).get("results", [])
        if video["type"] == "Trailer" and video["site"] == "YouTube"
    ]


def set_tmdb_series_info(series: dict):
    series["media_type"] = MediaType.series
    series["series_type"] = SeriesType.standard
    anime_pattern = re.compile("(?i)anim(e|ation)")
    genres = [genre["name"] for genre in series.get("genres", [])]
    for genre in genres:
        if anime_pattern.match(genre):
            series["series_type"] = SeriesType.anime
            break
    series["genres"] = genres
    series["videos"] = [
        video
        for video in series.get("videos", {}).get("results", [])
        if video["type"] == "Trailer" and video["site"] == "YouTube"
    ]
