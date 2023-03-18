import re
from typing import Any

from server.core.config import get_config
from server.core.http_client import HttpClient
from server.models.media import MediaType, SeriesType
from server.schemas.media import (
    EpisodeSchema,
    MediaSearchResponse,
    MovieSchema,
    Person,
    SeasonSchema,
    SeriesSchema,
)
from server.schemas.search import PersonSearchResponse
from server.schemas.tmdb import TmdbCast, TmdbEpisode, TmdbMovie, TmdbPerson, TmdbSeason, TmdbSeries

TMDB_API_KEY = get_config().tmdb_api_key
TMDB_URL = "https://api.themoviedb.org/3"


async def search_tmdb_media(term: str, page: int) -> MediaSearchResponse:
    search = await HttpClient.get(
        f"{TMDB_URL}/search/multi",
        params={"api_key": TMDB_API_KEY, "append_to_response": "external_ids", "query": term, "page": page},
    )
    results = []
    for media in search["results"]:
        parsed_media: MovieSchema | SeriesSchema
        if media["media_type"] == "tv":
            del media["media_type"]
            parsed_media = SeriesSchema(**TmdbSeries.parse_obj(media).dict())
        elif media["media_type"] == "movie":
            del media["media_type"]
            parsed_media = MovieSchema(**TmdbMovie.parse_obj(media).dict())
        else:
            continue
        results.append(parsed_media)

    return MediaSearchResponse(
        items=results,
        page=page,
        pages=search["total_pages"],
        total=search["total_results"],
    )


async def search_tmdb_movies(term: str, page: int) -> MediaSearchResponse:
    search = await HttpClient.get(
        f"{TMDB_URL}/search/movie",
        params={"api_key": TMDB_API_KEY, "append_to_response": "external_ids", "query": term, "page": page},
    )
    results = []
    for movie in search["results"]:
        parsed_movie = MovieSchema(**TmdbMovie.parse_obj(movie).dict())
        results.append(parsed_movie)
    return MediaSearchResponse(
        items=results,
        page=page,
        pages=search["total_pages"],
        total=search["total_results"],
    )


async def search_tmdb_series(term: str, page: int) -> MediaSearchResponse:
    search = await HttpClient.get(
        f"{TMDB_URL}/search/tv",
        params={"api_key": TMDB_API_KEY, "append_to_response": "external_ids", "query": term, "page": page},
    )
    results = []
    for series in search["results"]:
        parsed_media = SeriesSchema(**TmdbSeries.parse_obj(series).dict())
        results.append(parsed_media)

    return MediaSearchResponse(
        items=results,
        page=page,
        pages=search["total_pages"],
        total=search["total_results"],
    )


async def search_people(term: str, page: int) -> PersonSearchResponse:
    search = await HttpClient.request(
        "GET",
        f"{TMDB_URL}/search/person",
        params={"api_key": TMDB_API_KEY, "query": term, "page": page},
    )

    results = []
    for series in search["results"]:
        parsed_media = Person(**TmdbCast.parse_obj(series).dict())
        results.append(parsed_media)

    return PersonSearchResponse(items=results, page=page, pages=search["total_pages"], total=search["total_results"])


async def get_tmdb_movie(tmdb_id: int) -> MovieSchema | None:
    movie = await HttpClient.get(
        f"{TMDB_URL}/movie/{tmdb_id}",
        params={"api_key": TMDB_API_KEY, "append_to_response": "external_ids,credits,videos"},
    )
    return MovieSchema(**TmdbMovie.parse_obj(movie).dict())


async def get_tmdb_series(tmdb_id: int) -> SeriesSchema | None:
    series = await HttpClient.get(
        f"{TMDB_URL}/tv/{tmdb_id}",
        params={"api_key": TMDB_API_KEY, "append_to_response": "external_ids,aggregate_credits,videos"},
    )
    return SeriesSchema(**TmdbSeries.parse_obj(series).dict())


async def get_tmdb_season(tmdb_id: int, season_number: int) -> SeasonSchema | None:
    season = await HttpClient.get(
        f"{TMDB_URL}/tv/{tmdb_id}/season/{season_number}",
        params={"api_key": TMDB_API_KEY, "append_to_response": "external_ids,credits"},
    )
    return SeasonSchema(**TmdbSeason.parse_obj(season).dict())


async def get_tmdb_episode(tmdb_id: int, season_number: int, episode_number: int) -> EpisodeSchema | None:
    episode = await HttpClient.get(
        f"{TMDB_URL}/tv/{tmdb_id}/season/{season_number}/episode/{episode_number}",
        params={"api_key": TMDB_API_KEY, "append_to_response": "external_ids,credits"},
    )
    return EpisodeSchema(**TmdbEpisode.parse_obj(episode).dict())


async def get_tmdb_person(tmdb_person_id: int) -> Person | None:
    person = await HttpClient.request(
        "GET",
        f"{TMDB_URL}/person/{tmdb_person_id}",
        params={"api_key": TMDB_API_KEY, "append_to_response": "combined_credits"},
    )
    return Person(**TmdbPerson.parse_obj(person).dict())


async def find_tmdb_id_from_external_id(
    media_type: MediaType,
    imdb_id: str | None = None,
    tvdb_id: int | None = None,
) -> int | None:
    find = {}
    if imdb_id is not None:
        find = await HttpClient.get(
            f"{TMDB_URL}/find/{imdb_id}",
            params={"api_key": TMDB_API_KEY, "external_source": "imdb_id"},
        )
    elif tvdb_id is not None:
        find = await HttpClient.get(
            f"{TMDB_URL}/find/{imdb_id}",
            params={"api_key": TMDB_API_KEY, "external_source": "tvdb_id"},
        )
    tmdb_results: list[dict[str, Any]] = (
        find.get("tv_results", {}) if media_type == MediaType.series else find.get("movie_results", {})
    )
    tmdb_media = next(iter(tmdb_results), None)
    if tmdb_media is None:
        return None
    return tmdb_media.get("id", None)


async def find_external_ids_from_tmdb_id(tmdb_id: int) -> dict[str, Any]:
    return await HttpClient.get(
        f"{TMDB_URL}/tv/{tmdb_id}/external_ids",
        params={"api_key": TMDB_API_KEY},
    )


async def get_tmdb_popular_movies(page: int = 1) -> MediaSearchResponse:
    search = await HttpClient.get(f"{TMDB_URL}/movie/popular", params={"api_key": TMDB_API_KEY, "page": page})
    results = []

    for movie in search["results"]:
        parsed_movie = MovieSchema(**TmdbMovie.parse_obj(movie).dict())
        results.append(parsed_movie)
    return MediaSearchResponse(
        items=results,
        page=page,
        pages=search["total_pages"],
        total=search["total_results"],
    )


async def get_tmdb_upcoming_movies(page: int = 1) -> MediaSearchResponse:
    search = await HttpClient.get(f"{TMDB_URL}/movie/upcoming", params={"api_key": TMDB_API_KEY, "page": page})
    results = []

    for movie in search["results"]:
        parsed_movie = MovieSchema(**TmdbMovie.parse_obj(movie).dict())
        results.append(parsed_movie)
    return MediaSearchResponse(
        items=results,
        page=page,
        pages=search["total_pages"],
        total=search["total_results"],
    )


async def get_tmdb_similar_movies(tmdb_id: int, page: int = 1) -> MediaSearchResponse:
    search = await HttpClient.get(
        f"{TMDB_URL}/movie/{tmdb_id}/similar",
        params={"api_key": TMDB_API_KEY, "page": page},
    )
    results = []

    for movie in search["results"]:
        parsed_movie = MovieSchema(**TmdbMovie.parse_obj(movie).dict())
        results.append(parsed_movie)
    return MediaSearchResponse(
        items=results,
        page=page,
        pages=search["total_pages"],
        total=search["total_results"],
    )


async def get_tmdb_recommended_movies(tmdb_id: int, page: int = 1) -> MediaSearchResponse:
    search = await HttpClient.get(
        f"{TMDB_URL}/movie/{tmdb_id}/recommendations",
        params={"api_key": TMDB_API_KEY, "page": page},
    )
    results = []
    for movie in search["results"]:
        parsed_movie = MovieSchema(**TmdbMovie.parse_obj(movie).dict())
        results.append(parsed_movie)

    return MediaSearchResponse(
        items=results,
        page=page,
        pages=search["total_pages"],
        total=search["total_results"],
    )


async def get_tmdb_movies_discover(
    genre_id: int | None = None,
    page: int = 1,
) -> MediaSearchResponse:
    queries = {}
    if genre_id is not None:
        queries["with_genres"] = genre_id

    search = await HttpClient.request(
        "GET",
        f"{TMDB_URL}/discover/movie",
        params=dict(api_key=TMDB_API_KEY, **queries, page=page),
    )

    results = []
    for movie in search["results"]:
        parsed_movie = MovieSchema(**TmdbMovie.parse_obj(movie).dict())
        results.append(parsed_movie)

    return MediaSearchResponse(
        items=results,
        page=page,
        pages=search["total_pages"],
        total=search["total_results"],
    )


async def get_tmdb_popular_series(page: int = 1) -> MediaSearchResponse:
    search = await HttpClient.get(f"{TMDB_URL}/tv/popular", params={"api_key": TMDB_API_KEY, "page": page})
    results = []
    for series in search["results"]:
        parsed_series = SeriesSchema(**TmdbSeries.parse_obj(series).dict())
        results.append(parsed_series)

    return MediaSearchResponse(
        items=results,
        page=page,
        pages=search["total_pages"],
        total=search["total_results"],
    )


async def get_tmdb_similar_series(tmdb_id: int, page: int = 1) -> MediaSearchResponse:
    search = await HttpClient.get(
        f"{TMDB_URL}/tv/{tmdb_id}/similar",
        params={"api_key": TMDB_API_KEY, "page": page},
    )
    results = []

    for series in search["results"]:
        parsed_series = SeriesSchema(**TmdbSeries.parse_obj(series).dict())
        results.append(parsed_series)

    return MediaSearchResponse(
        items=results,
        page=page,
        pages=search["total_pages"],
        total=search["total_results"],
    )


async def get_tmdb_recommended_series(tmdb_id: int, page: int = 1) -> MediaSearchResponse:
    search = await HttpClient.get(
        f"{TMDB_URL}/tv/{tmdb_id}/recommendations",
        params={"api_key": TMDB_API_KEY, "page": page},
    )
    results = []
    for series in search["results"]:
        parsed_series = SeriesSchema(**TmdbSeries.parse_obj(series).dict())
        results.append(parsed_series)

    return MediaSearchResponse(
        items=results,
        page=page,
        pages=search["total_pages"],
        total=search["total_results"],
    )


async def get_tmdb_series_discover(
    genre_id: int | None = None,
    page: int = 1,
) -> MediaSearchResponse:
    queries = {}
    if genre_id is not None:
        queries["with_genres"] = genre_id

    search = await HttpClient.request(
        "GET",
        f"{TMDB_URL}/discover/tv",
        params=dict(api_key=TMDB_API_KEY, **queries, page=page),
    )

    results = []
    for movie in search["results"]:
        parsed_movie = MovieSchema(**TmdbMovie.parse_obj(movie).dict())
        results.append(parsed_movie)

    return MediaSearchResponse(page=page, pages=search["total_pages"], total=search["total_results"], items=results)


def set_tmdb_movie_info(movie: dict[str, Any]) -> None:
    movie["media_type"] = MediaType.movie
    genres = [genre["name"] for genre in movie.get("genres", [])]
    movie["genres"] = genres
    movie["videos"] = [
        video
        for video in movie.get("videos", {}).get("results", [])
        if video["type"] == "Trailer" and video["site"] == "YouTube"
    ]


def set_tmdb_series_info(series: dict[str, Any]) -> None:
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
