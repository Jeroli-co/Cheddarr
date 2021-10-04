import re
from typing import List, Optional, Union

from server.core.config import get_config
from server.core.http_client import HttpClient
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

TMDB_API_KEY = get_config().tmdb_api_key
TMDB_URL = "https://api.themoviedb.org/3"


async def search_tmdb_media(
    term: str, page: int
) -> (List[Union[MovieSchema, SeriesSchema]], int, int):
    search = await HttpClient.request(
        "GET",
        f"{TMDB_URL}/search/multi",
        params=dict(
            api_key=TMDB_API_KEY, append_to_response="external_ids", query=term, page=page
        ),
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
    search = await HttpClient.request(
        "GET",
        f"{TMDB_URL}/search/movie",
        params=dict(
            api_key=TMDB_API_KEY, append_to_response="external_ids", query=term, page=page
        ),
    )
    results = []
    for movie in search["results"]:
        parsed_movie = MovieSchema(**TmdbMovie.parse_obj(movie).dict())
        results.append(parsed_movie)
    return results, search["total_pages"], search["total_results"]


async def search_tmdb_series(term: str, page: int) -> (List[SeriesSchema], int, int):
    search = await HttpClient.request(
        "GET",
        f"{TMDB_URL}/search/tv",
        params=dict(
            api_key=TMDB_API_KEY, append_to_response="external_ids", query=term, page=page
        ),
    )
    results = []
    for series in search["results"]:
        parsed_media = SeriesSchema(**TmdbSeries.parse_obj(series).dict())
        results.append(parsed_media)
    return results, search["total_pages"], search["total_results"]


async def get_tmdb_movie(tmdb_id: int) -> Optional[MovieSchema]:
    movie = await HttpClient.request(
        "GET",
        f"{TMDB_URL}/movie/{tmdb_id}",
        params=dict(api_key=TMDB_API_KEY, append_to_response="external_ids,credits,videos"),
    )
    set_tmdb_movie_info(movie)
    return MovieSchema(**TmdbMovie.parse_obj(movie).dict())


async def get_tmdb_series(tmdb_id: int) -> Optional[SeriesSchema]:
    series = await HttpClient.request(
        "GET",
        f"{TMDB_URL}/tv/{tmdb_id}",
        params=dict(
            api_key=TMDB_API_KEY, append_to_response="external_ids,aggregate_credits,videos"
        ),
    )
    set_tmdb_series_info(series)
    return SeriesSchema(**TmdbSeries.parse_obj(series).dict())


async def get_tmdb_season(tmdb_id: int, season_number: int) -> Optional[SeasonSchema]:
    season = await HttpClient.request(
        "GET",
        f"{TMDB_URL}/tv/{tmdb_id}/season/{season_number}",
        params=dict(api_key=TMDB_API_KEY, append_to_response="external_ids,credits"),
    )
    return SeasonSchema(**TmdbSeason.parse_obj(season).dict())


async def get_tmdb_episode(
    tmdb_id: int, season_number: int, episode_number: int
) -> Optional[EpisodeSchema]:
    episode = await HttpClient.request(
        "GET",
        f"{TMDB_URL}/tv/{tmdb_id}/season/{season_number}/episode/{episode_number}",
        params=dict(api_key=TMDB_API_KEY, append_to_response="external_ids,credits"),
    )
    return EpisodeSchema(**TmdbEpisode.parse_obj(episode).dict())


async def find_tmdb_id_from_external_id(imdb_id=None, tvdb_id=None) -> int:
    find = {}
    if not find and imdb_id is not None:
        find = await HttpClient.request(
            "GET",
            f"{TMDB_URL}/find/{imdb_id}",
            params=dict(api_key=TMDB_API_KEY, external_source="imdb_id"),
        )
    elif not find and tvdb_id is not None:
        find = await HttpClient.request(
            "GET",
            f"{TMDB_URL}/find/{imdb_id}",
            params=dict(api_key=TMDB_API_KEY, external_source="tvdb_id"),
        )
    tmdb_media = next((m[0] for m in find.values() if m), {})
    return tmdb_media.get("id")


async def find_external_ids_from_tmdb_id(tmdb_id: int) -> dict:
    return await HttpClient.request(
        "GET",
        f"{TMDB_URL}/tv/{tmdb_id}/external_ids",
        params=dict(api_key=TMDB_API_KEY),
    )


async def get_tmdb_popular_movies(page: int = 1) -> (List[MovieSchema], int, int):
    search = await HttpClient.request(
        "GET", f"{TMDB_URL}/movie/popular", params=dict(api_key=TMDB_API_KEY, page=page)
    )
    results = []

    for movie in search["results"]:
        set_tmdb_movie_info(movie)
        parsed_movie = MovieSchema(**TmdbMovie.parse_obj(movie).dict())
        results.append(parsed_movie)
    return results, search["total_pages"], search["total_results"]


async def get_tmdb_upcoming_movies(page: int = 1) -> (List[MovieSchema], int, int):
    search = await HttpClient.request(
        "GET", f"{TMDB_URL}/movie/upcoming", params=dict(api_key=TMDB_API_KEY, page=page)
    )
    results = []

    for movie in search["results"]:
        set_tmdb_movie_info(movie)
        parsed_movie = MovieSchema(**TmdbMovie.parse_obj(movie).dict())
        results.append(parsed_movie)
    return results, search["total_pages"], search["total_results"]


async def get_tmdb_similar_movies(tmdb_id: int, page: int = 1) -> (List[MovieSchema], int, int):
    search = await HttpClient.request(
        "GET", f"{TMDB_URL}/movie/{tmdb_id}/similar", params=dict(api_key=TMDB_API_KEY, page=page)
    )
    results = []

    for movie in search["results"]:
        set_tmdb_movie_info(movie)
        parsed_movie = MovieSchema(**TmdbMovie.parse_obj(movie).dict())
        results.append(parsed_movie)
    return results, search["total_pages"], search["total_results"]


async def get_tmdb_recommended_movies(
    tmdb_id: int, page: int = 1
) -> (List[MovieSchema], int, int):
    search = await HttpClient.request(
        "GET",
        f"{TMDB_URL}/movie/{tmdb_id}/recommendations",
        params=dict(api_key=TMDB_API_KEY, page=page),
    )
    results = []

    for movie in search["results"]:
        set_tmdb_movie_info(movie)
        parsed_movie = MovieSchema(**TmdbMovie.parse_obj(movie).dict())
        results.append(parsed_movie)
    return results, search["total_pages"], search["total_results"]


async def get_tmdb_popular_series(page: int = 1) -> (List[SeriesSchema], int, int):
    search = await HttpClient.request(
        "GET", f"{TMDB_URL}/tv/popular", params=dict(api_key=TMDB_API_KEY, page=page)
    )
    results = []

    for series in search["results"]:
        set_tmdb_series_info(series)
        parsed_series = SeriesSchema(**TmdbSeries.parse_obj(series).dict())
        results.append(parsed_series)
    return results, search["total_pages"], search["total_results"]


async def get_tmdb_similar_series(tmdb_id: int, page: int = 1) -> (List[SeriesSchema], int, int):
    search = await HttpClient.request(
        "GET", f"{TMDB_URL}/tv/{tmdb_id}/similar", params=dict(api_key=TMDB_API_KEY, page=page)
    )
    results = []

    for series in search["results"]:
        set_tmdb_series_info(series)
        parsed_series = SeriesSchema(**TmdbSeries.parse_obj(series).dict())
        results.append(parsed_series)
    return results, search["total_pages"], search["total_results"]


async def get_tmdb_recommended_series(
    tmdb_id: int, page: int = 1
) -> (List[SeriesSchema], int, int):
    search = await HttpClient.request(
        "GET",
        f"{TMDB_URL}/tv/{tmdb_id}/recommendations",
        params=dict(api_key=TMDB_API_KEY, page=page),
    )
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
