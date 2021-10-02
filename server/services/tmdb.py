import re
from abc import ABC
from typing import Optional, Union

from pydantic import AnyHttpUrl, Field, root_validator, validator

from server.core.config import get_config
from server.core.http_client import HttpClient
from server.models.media import MediaType, SeriesType
from server.schemas.core import Date
from server.schemas.media import (
    Company,
    Credits,
    EpisodeSchema,
    Genre,
    MediaSchema,
    MovieSchema,
    Person,
    PersonCredits,
    SeasonSchema,
    SeriesSchema,
    Video,
)

TMDB_API_KEY = get_config().tmdb_api_key
TMDB_URL = "https://api.themoviedb.org/3"
TMDB_IMAGES_URL = "https://image.tmdb.org/t/p"
TMDB_POSTER_SIZE = "w600_and_h900_bestv2"
TMDB_PROFILE_SIZE = "w185"
TMDB_ART_SIZE = "w1280"


###################################
# Validators                      #
###################################
def get_image_url(cls, v, field):
    if v is None:
        return None
    if field.alias == "poster_path":
        return f"{TMDB_IMAGES_URL}/{TMDB_POSTER_SIZE}/{v}"
    if field.alias == "backdrop_path":
        return f"{TMDB_IMAGES_URL}/{TMDB_ART_SIZE}/{v}"
    if field.alias == "profile_path":
        return f"{TMDB_IMAGES_URL}/{TMDB_PROFILE_SIZE}/{v}"


def set_tmdb_movie_info(cls, values):
    values["media_type"] = MediaType.movie
    values["videos"] = [
        video
        for video in values.get("videos", {}).get("results", [])
        if video["type"] == "Trailer" and video["site"] == "YouTube"
    ]
    return values


def set_tmdb_series_info(cls, values):
    values["media_type"] = MediaType.series
    values["series_type"] = SeriesType.standard
    anime_pattern = re.compile("(?i)anim(e|ation)")
    for genre in values.get("genres", []):
        if anime_pattern.match(genre["name"]):
            values["series_type"] = SeriesType.anime
            break
    values["videos"] = [
        video
        for video in values.get("videos", {}).get("results", [])
        if video["type"] == "Trailer" and video["site"] == "YouTube"
    ]
    return values


###################################
# Schemas                         #
###################################
class TmdbPersonCredits(PersonCredits):
    cast: "list[Union[TmdbSeries, TmdbMovie]]"


class TmdbPerson(Person):
    name: str = Field(alias="name", pre=True)
    also_known_as: Optional[list[str]] = Field(alias="also_known_as")
    biography: Optional[str] = Field(alias="biography")
    birth_day: Optional[Date] = Field(alias="birthday")
    death_day: Optional[Date] = Field(alias="deathday")
    credits: Optional[TmdbPersonCredits] = Field(alias="combined_credits")
    picture_url: Optional[AnyHttpUrl] = Field(alias="profile_path")
    _picture_validator = validator("picture_url", allow_reuse=True, pre=True)(get_image_url)


class TmdbCast(TmdbPerson):
    role: Optional[str] = Field(alias="character")


class TmdbCrew(TmdbPerson):
    role: Optional[str] = Field(alias="job")


class TmdbCredits(Credits):
    cast: list[TmdbCast] = Field(alias="cast")
    crew: list[TmdbCrew] = Field(alias="crew")


class TmdbCompany(Company):
    name: str


class TmdbVideo(Video):
    key: str = Field(alias="key")
    type: str = Field(alias="type")
    site: str = Field(alias="site")
    video_url: Optional[AnyHttpUrl]

    @validator("key", pre=True)
    def get_video_url(cls, key, values):
        values["video_url"] = f"https://www.youtube.com/watch?v={key}"
        return key


class TmdbMedia(MediaSchema, ABC):
    tmdb_id: int = Field(alias="id")
    external_ids: Optional[dict] = Field(alias="external_ids", default={})
    title: str = Field(alias="name")
    summary: Optional[str] = Field(alias="overview")
    genres: Optional[list[Genre]] = Field(alias="genres")
    status: Optional[str] = Field(alias="status")
    rating: Optional[float] = Field(alias="vote_average")
    poster_url: Optional[AnyHttpUrl] = Field(alias="poster_path")
    art_url: Optional[AnyHttpUrl] = Field(alias="backdrop_path")
    credits: Optional[TmdbCredits] = Field(alias="credits")
    trailers: Optional[list[TmdbVideo]] = Field(alias="videos")
    _poster_validator = validator("poster_url", allow_reuse=True, pre=True)(get_image_url)
    _art_validator = validator("art_url", allow_reuse=True, pre=True)(get_image_url)

    @root_validator(pre=True)
    def get_external_ids(cls, values):
        values["tvdb_id"] = values.get("external_ids", {}).get("tvdb_id")
        values["imdb_id"] = values.get("external_ids", {}).get("imdb_id")
        return values


class TmdbMovie(TmdbMedia, MovieSchema):
    duration: Optional[int] = Field(alias="runtime")
    studios: Optional[list[TmdbCompany]] = Field(alias="production_companies")
    release_date: Optional[Date] = Field(alias="release_date")
    _movie_validator = root_validator(allow_reuse=True, pre=True)(set_tmdb_movie_info)


class TmdbEpisode(TmdbMedia, EpisodeSchema):
    episode_number: int = Field(alias="episode_number")
    release_date: Optional[Date] = Field(alias="air_date")


class TmdbSeason(TmdbMedia, SeasonSchema):
    season_number: int = Field(alias="season_number")
    episodes: Optional[list[TmdbEpisode]] = Field(alias="episodes")
    release_date: Optional[Date] = Field(alias="air_date")


class TmdbSeries(TmdbMedia, SeriesSchema):
    number_of_seasons: Optional[int] = Field(alias="number_of_seasons")
    seasons: Optional[list[TmdbSeason]] = Field(alias="seasons")
    studios: Optional[list[TmdbCompany]] = Field(alias="networks")
    release_date: Optional[Date] = Field(alias="first_air_date")
    credits: Optional[TmdbCredits] = Field(alias="aggregate_credits")
    _series_validator = root_validator(allow_reuse=True, pre=True)(set_tmdb_series_info)


TmdbPersonCredits.update_forward_refs()


###################################
# API calls                       #
###################################
async def search_tmdb_media(
    term: str, page: int
) -> (list[Union[MovieSchema, SeriesSchema]], int, int):
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


async def search_tmdb_movies(term: str, page: int) -> (list[MovieSchema], int, int):
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


async def search_tmdb_series(term: str, page: int) -> (list[SeriesSchema], int, int):
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


async def search_people(term: str, page: int) -> (list[SeriesSchema], int, int):
    search = await HttpClient.request(
        "GET",
        f"{TMDB_URL}/search/person",
        params=dict(api_key=TMDB_API_KEY, query=term, page=page),
    )
    results = []
    for series in search["results"]:
        parsed_media = Person(**TmdbCast.parse_obj(series).dict())
        results.append(parsed_media)
    return results, search["total_pages"], search["total_results"]


async def get_tmdb_movie(tmdb_id: int) -> Optional[MovieSchema]:
    movie = await HttpClient.request(
        "GET",
        f"{TMDB_URL}/movie/{tmdb_id}",
        params=dict(api_key=TMDB_API_KEY, append_to_response="external_ids,credits,videos"),
    )
    return MovieSchema(**TmdbMovie.parse_obj(movie).dict())


async def get_tmdb_series(tmdb_id: int) -> Optional[SeriesSchema]:
    series = await HttpClient.request(
        "GET",
        f"{TMDB_URL}/tv/{tmdb_id}",
        params=dict(
            api_key=TMDB_API_KEY, append_to_response="external_ids,aggregate_credits,videos"
        ),
    )
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


async def get_tmdb_person(tmdb_person_id: int) -> Optional[Person]:
    person = await HttpClient.request(
        "GET",
        f"{TMDB_URL}/person/{tmdb_person_id}",
        params=dict(api_key=TMDB_API_KEY, append_to_response="combined_credits"),
    )
    return Person(**TmdbPerson.parse_obj(person).dict())


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


async def get_tmdb_popular_movies(page: int = 1) -> (list[MovieSchema], int, int):
    search = await HttpClient.request(
        "GET", f"{TMDB_URL}/movie/popular", params=dict(api_key=TMDB_API_KEY, page=page)
    )
    results = []
    for movie in search["results"]:
        parsed_movie = MovieSchema(**TmdbMovie.parse_obj(movie).dict())
        results.append(parsed_movie)
    return results, search["total_pages"], search["total_results"]


async def get_tmdb_upcoming_movies(page: int = 1) -> (list[MovieSchema], int, int):
    search = await HttpClient.request(
        "GET", f"{TMDB_URL}/movie/upcoming", params=dict(api_key=TMDB_API_KEY, page=page)
    )
    results = []
    for movie in search["results"]:
        parsed_movie = MovieSchema(**TmdbMovie.parse_obj(movie).dict())
        results.append(parsed_movie)
    return results, search["total_pages"], search["total_results"]


async def get_tmdb_similar_movies(tmdb_id: int, page: int = 1) -> (list[MovieSchema], int, int):
    search = await HttpClient.request(
        "GET", f"{TMDB_URL}/movie/{tmdb_id}/similar", params=dict(api_key=TMDB_API_KEY, page=page)
    )
    results = []
    for movie in search["results"]:
        parsed_movie = MovieSchema(**TmdbMovie.parse_obj(movie).dict())
        results.append(parsed_movie)
    return results, search["total_pages"], search["total_results"]


async def get_tmdb_recommended_movies(
    tmdb_id: int, page: int = 1
) -> (list[MovieSchema], int, int):
    search = await HttpClient.request(
        "GET",
        f"{TMDB_URL}/movie/{tmdb_id}/recommendations",
        params=dict(api_key=TMDB_API_KEY, page=page),
    )
    results = []
    for movie in search["results"]:
        parsed_movie = MovieSchema(**TmdbMovie.parse_obj(movie).dict())
        results.append(parsed_movie)
    return results, search["total_pages"], search["total_results"]


async def get_tmdb_movies_discover(
    genre_id: Optional[int] = None, page: int = 1
) -> (list[MovieSchema], int, int):
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
    return results, search["total_pages"], search["total_results"]


async def get_tmdb_popular_series(page: int = 1) -> (list[SeriesSchema], int, int):
    search = await HttpClient.request(
        "GET", f"{TMDB_URL}/tv/popular", params=dict(api_key=TMDB_API_KEY, page=page)
    )
    results = []
    for series in search["results"]:
        parsed_series = SeriesSchema(**TmdbSeries.parse_obj(series).dict())
        results.append(parsed_series)
    return results, search["total_pages"], search["total_results"]


async def get_tmdb_similar_series(tmdb_id: int, page: int = 1) -> (list[SeriesSchema], int, int):
    search = await HttpClient.request(
        "GET", f"{TMDB_URL}/tv/{tmdb_id}/similar", params=dict(api_key=TMDB_API_KEY, page=page)
    )
    results = []
    for series in search["results"]:
        parsed_series = SeriesSchema(**TmdbSeries.parse_obj(series).dict())
        results.append(parsed_series)
    return results, search["total_pages"], search["total_results"]


async def get_tmdb_recommended_series(
    tmdb_id: int, page: int = 1
) -> (list[SeriesSchema], int, int):
    search = await HttpClient.request(
        "GET",
        f"{TMDB_URL}/tv/{tmdb_id}/recommendations",
        params=dict(api_key=TMDB_API_KEY, page=page),
    )
    results = []
    for series in search["results"]:
        parsed_series = SeriesSchema(**TmdbSeries.parse_obj(series).dict())
        results.append(parsed_series)
    return results, search["total_pages"], search["total_results"]


async def get_tmdb_series_discover(
    genre_id: Optional[int] = None, page: int = 1
) -> (list[MovieSchema], int, int):
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
    return results, search["total_pages"], search["total_results"]
