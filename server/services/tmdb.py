from typing import Any

from server.core.config import get_config
from server.core.http_client import HttpClient
from server.models.media import MediaType
from server.schemas.base import PaginatedResponse
from server.schemas.media import (
    EpisodeSchema,
    MediaSchema,
    MovieSchema,
    Person,
    SeasonSchema,
    SeriesSchema,
)
from server.schemas.tmdb import TmdbCast, TmdbEpisode, TmdbMovie, TmdbPerson, TmdbSeason, TmdbSeries

TMDB_API_KEY = get_config().tmdb_api_key
TMDB_URL = "https://api.themoviedb.org/3"


async def search_tmdb_media(term: str, page: int) -> PaginatedResponse[MediaSchema]:
    search = await HttpClient.get(
        f"{TMDB_URL}/search/multi",
        params={"api_key": TMDB_API_KEY, "append_to_response": "external_ids", "query": term, "page": page},
    )
    results = []
    for media in search["results"]:
        parsed_media: MovieSchema | SeriesSchema
        if media["media_type"] == "tv":
            del media["media_type"]
            parsed_media = SeriesSchema(**TmdbSeries.model_validate(media).model_dump())
        elif media["media_type"] == "movie":
            del media["media_type"]
            parsed_media = MovieSchema(**TmdbMovie.model_validate(media).model_dump())
        else:
            continue
        results.append(parsed_media)

    return PaginatedResponse[MediaSchema](
        results=results,
        page=page,
        pages=search["total_pages"],
        total=search["total_results"],
    )


async def search_tmdb_movies(term: str, page: int) -> PaginatedResponse[MediaSchema]:
    search = await HttpClient.get(
        f"{TMDB_URL}/search/movie",
        params={"api_key": TMDB_API_KEY, "append_to_response": "external_ids", "query": term, "page": page},
    )
    results = []
    for movie in search["results"]:
        parsed_movie = MovieSchema(**TmdbMovie.model_validate(movie).model_dump())
        results.append(parsed_movie)

    return PaginatedResponse[MediaSchema](
        results=results,
        page=page,
        pages=search["total_pages"],
        total=search["total_results"],
    )


async def search_tmdb_series(term: str, page: int) -> PaginatedResponse[MediaSchema]:
    search = await HttpClient.get(
        f"{TMDB_URL}/search/tv",
        params={"api_key": TMDB_API_KEY, "append_to_response": "external_ids", "query": term, "page": page},
    )
    results = []
    for series in search["results"]:
        parsed_media = SeriesSchema(**TmdbSeries.model_validate(series).model_dump())
        results.append(parsed_media)

    return PaginatedResponse[MediaSchema](
        results=results,
        page=page,
        pages=search["total_pages"],
        total=search["total_results"],
    )


async def search_people(term: str, page: int) -> PaginatedResponse[Person]:
    search = await HttpClient.get(
        f"{TMDB_URL}/search/person",
        params={"api_key": TMDB_API_KEY, "query": term, "page": page},
    )

    results = []
    for series in search["results"]:
        parsed_media = Person(**TmdbCast.model_validate(series).model_dump())
        results.append(parsed_media)

    return PaginatedResponse[Person](
        results=results,
        page=page,
        pages=search["total_pages"],
        total=search["total_results"],
    )


async def get_tmdb_movie(tmdb_id: int) -> MovieSchema | None:
    movie = await HttpClient.get(
        f"{TMDB_URL}/movie/{tmdb_id}",
        params={"api_key": TMDB_API_KEY, "append_to_response": "external_ids,credits,videos"},
    )

    return MovieSchema(**TmdbMovie.model_validate(movie).model_dump())


async def get_tmdb_series(tmdb_id: int) -> SeriesSchema | None:
    series = await HttpClient.get(
        f"{TMDB_URL}/tv/{tmdb_id}",
        params={"api_key": TMDB_API_KEY, "append_to_response": "external_ids,aggregate_credits,videos"},
    )

    return SeriesSchema(**TmdbSeries.model_validate(series).model_dump())


async def get_tmdb_season(tmdb_id: int, season_number: int) -> SeasonSchema | None:
    season = await HttpClient.get(
        f"{TMDB_URL}/tv/{tmdb_id}/season/{season_number}",
        params={"api_key": TMDB_API_KEY, "append_to_response": "external_ids,credits"},
    )

    return SeasonSchema(**TmdbSeason.model_validate(season).model_dump())


async def get_tmdb_episode(tmdb_id: int, season_number: int, episode_number: int) -> EpisodeSchema | None:
    episode = await HttpClient.get(
        f"{TMDB_URL}/tv/{tmdb_id}/season/{season_number}/episode/{episode_number}",
        params={"api_key": TMDB_API_KEY, "append_to_response": "external_ids,credits"},
    )

    return EpisodeSchema(**TmdbEpisode.model_validate(episode).model_dump())


async def get_tmdb_person(tmdb_person_id: int) -> Person | None:
    person = await HttpClient.get(
        f"{TMDB_URL}/person/{tmdb_person_id}",
        params={"api_key": TMDB_API_KEY, "append_to_response": "combined_credits"},
    )

    return Person(**TmdbPerson.model_validate(person).model_dump())


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


async def get_tmdb_popular_movies(page: int = 1) -> PaginatedResponse[MovieSchema]:
    search = await HttpClient.get(f"{TMDB_URL}/movie/popular", params={"api_key": TMDB_API_KEY, "page": page})
    results = []

    for movie in search["results"]:
        parsed_movie = MovieSchema(**TmdbMovie.model_validate(movie).model_dump())
        results.append(parsed_movie)

    return PaginatedResponse[MovieSchema](
        results=results,
        page=page,
        pages=search["total_pages"],
        total=search["total_results"],
    )


async def get_tmdb_upcoming_movies(page: int = 1) -> PaginatedResponse[MovieSchema]:
    search = await HttpClient.get(f"{TMDB_URL}/movie/upcoming", params={"api_key": TMDB_API_KEY, "page": page})
    results = []

    for movie in search["results"]:
        parsed_movie = MovieSchema(**TmdbMovie.model_validate(movie).model_dump())
        results.append(parsed_movie)

    return PaginatedResponse[MovieSchema](
        results=results,
        page=page,
        pages=search["total_pages"],
        total=search["total_results"],
    )


async def get_tmdb_similar_movies(tmdb_id: int, page: int = 1) -> PaginatedResponse[MovieSchema]:
    search = await HttpClient.get(
        f"{TMDB_URL}/movie/{tmdb_id}/similar",
        params={"api_key": TMDB_API_KEY, "page": page},
    )
    results = []

    for movie in search["results"]:
        parsed_movie = MovieSchema(**TmdbMovie.model_validate(movie).model_dump())
        results.append(parsed_movie)

    return PaginatedResponse[MovieSchema](
        results=results,
        page=page,
        pages=search["total_pages"],
        total=search["total_results"],
    )


async def get_tmdb_recommended_movies(tmdb_id: int, page: int = 1) -> PaginatedResponse[MovieSchema]:
    search = await HttpClient.get(
        f"{TMDB_URL}/movie/{tmdb_id}/recommendations",
        params={"api_key": TMDB_API_KEY, "page": page},
    )
    results = []
    for movie in search["results"]:
        del movie["media_type"]
        parsed_movie = MovieSchema(**TmdbMovie.model_validate(movie).model_dump())
        results.append(parsed_movie)

    return PaginatedResponse[MovieSchema](
        results=results,
        page=page,
        pages=search["total_pages"],
        total=search["total_results"],
    )


async def get_tmdb_movies_discover(
    genre_id: int | None = None,
    page: int = 1,
) -> PaginatedResponse[MovieSchema]:
    queries = {}
    if genre_id is not None:
        queries["with_genres"] = genre_id

    search = await HttpClient.get(
        f"{TMDB_URL}/discover/movie",
        params=dict(api_key=TMDB_API_KEY, **queries, page=page),
    )

    results = []
    for movie in search["results"]:
        parsed_movie = MovieSchema(**TmdbMovie.model_validate(movie).model_dump())
        results.append(parsed_movie)

    return PaginatedResponse[MovieSchema](
        results=results,
        page=page,
        pages=search["total_pages"],
        total=search["total_results"],
    )


async def get_tmdb_popular_series(page: int = 1) -> PaginatedResponse[SeriesSchema]:
    search = await HttpClient.get(f"{TMDB_URL}/tv/popular", params={"api_key": TMDB_API_KEY, "page": page})
    results = []
    for series in search["results"]:
        parsed_series = SeriesSchema(**TmdbSeries.model_validate(series).model_dump())
        results.append(parsed_series)

    return PaginatedResponse[SeriesSchema](
        results=results,
        page=page,
        pages=search["total_pages"],
        total=search["total_results"],
    )


async def get_tmdb_similar_series(tmdb_id: int, page: int = 1) -> PaginatedResponse[SeriesSchema]:
    search = await HttpClient.get(
        f"{TMDB_URL}/tv/{tmdb_id}/similar",
        params={"api_key": TMDB_API_KEY, "page": page},
    )
    results = []

    for series in search["results"]:
        parsed_series = SeriesSchema(**TmdbSeries.model_validate(series).model_dump())
        results.append(parsed_series)

    return PaginatedResponse[SeriesSchema](
        results=results,
        page=page,
        pages=search["total_pages"],
        total=search["total_results"],
    )


async def get_tmdb_recommended_series(tmdb_id: int, page: int = 1) -> PaginatedResponse[SeriesSchema]:
    search = await HttpClient.get(
        f"{TMDB_URL}/tv/{tmdb_id}/recommendations",
        params={"api_key": TMDB_API_KEY, "page": page},
    )
    results = []
    for series in search["results"]:
        del series["media_type"]
        parsed_series = SeriesSchema(**TmdbSeries.model_validate(series).model_dump())
        results.append(parsed_series)

    return PaginatedResponse[SeriesSchema](
        results=results,
        page=page,
        pages=search["total_pages"],
        total=search["total_results"],
    )


async def get_tmdb_series_discover(
    genre_id: int | None = None,
    page: int = 1,
) -> PaginatedResponse[SeriesSchema]:
    queries = {}
    if genre_id is not None:
        queries["with_genres"] = genre_id

    search = await HttpClient.get(
        f"{TMDB_URL}/discover/tv",
        params=dict(api_key=TMDB_API_KEY, **queries, page=page),
    )

    results = []
    for movie in search["results"]:
        parsed_movie = MovieSchema(**TmdbMovie.model_validate(movie).model_dump())
        results.append(parsed_movie)

    return PaginatedResponse[SeriesSchema](
        page=page,
        pages=search["total_pages"],
        total=search["total_results"],
        results=results,
    )
