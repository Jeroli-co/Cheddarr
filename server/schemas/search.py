from __future__ import annotations

from enum import Enum
from typing import List, Optional

from pydantic import AnyHttpUrl, BaseModel, Field

from server.models.requests import SeriesType
from server.schemas import APIModel, UserPublic

TMDB_URL = "https://www.themoviedb.org/"
TMDB_IMAGES_URL = "https://image.tmdb.org/t/p/"
TMDB_POSTER_SIZE = "w500"
TMDB_ART_SIZE = "w1280"


class QuickSearchType(str, Enum):
    movies = "movies"
    series = "series"
    friends = "friends"


class QuickSearch(APIModel):
    value: str
    type: Optional[QuickSearchType]
    page: int = 1


"""
class MediaSearchResultSchema(APIModel):
    ratingKey = ma.String(data_key="id")
    title = ma.String()
    year = ma.Integer()
    thumbUrl = ma.String()
    type = ma.String()

    @post_dump
    def media_type(self, media, **kwargs):
        media["type"] = media.get("type").replace("show", "series")
        return media
"""


class FriendSearchResult(UserPublic):
    type: QuickSearchType = Field(default=QuickSearchType.friends, const=True)


class TmdbMedia(APIModel):
    tmdb_id: int = Field(alias="id")
    summary: str = Field(alias="overview")
    rating: float = Field(alias="vote_average")
    thumbUrl: str = Field(alias="poster_path")
    art_url: str = Field(alias="backdrop_path")
    media_type: str
    status: str
    link: AnyHttpUrl = Field(
        default=lambda media: f"{TMDB_URL}{media['media_type']}/{media['id']}",
        const=True,
    )
    """

    @post_dump
    def get_thumbUrl(self, media, **kwargs):
        if media.get("thumbUrl") is None:
            return media
        else:
            media[
                "thumbUrl"
            ] = f"{TMDB_IMAGES_URL}{TMDB_POSTER_SIZE}{media['thumbUrl']}"
        return media

    @post_dump
    def get_art_url(self, media, **kwargs):
        if media.get("art_url") is None:
            return media
        else:
            media["art_url"] = f"{TMDB_IMAGES_URL}{TMDB_POSTER_SIZE}{media['art_url']}"
        return media

    @post_dump
    def media_type(self, media, **kwargs):
        media["media_type"] = media.get("media_type").replace("tv", "series")
        return media
"""


class TmdbMovie(TmdbMedia):
    title: str
    release_date: str
    media_type = Field(default="movie", const=True)
    link: AnyHttpUrl = Field(
        default=lambda media: f"{TMDB_URL}movie/{media['id']}", const=True
    )


class TmdbSeries(TmdbMedia):
    tvdb_id: int
    title: str = Field(alias="name")
    releaseDate: str = Field(alias="first_air_date")
    media_type = Field(default="series", const=True)
    seasons: List[TmdbSeason]
    series_type: SeriesType
    link: AnyHttpUrl = Field(
        default=lambda media: f"{TMDB_URL}tv/{media['id']}", const=True
    )


class TmdbSeason(APIModel):
    season_number: int
    name: str
    release_date = Field(alias="air_date")
    episodes: List[TmdbEpisode]


class TmdbEpisode(APIModel):
    episode_number: int
    name: str
    release_date = Field(alias="air_date")


class TmdbMediaSearchResult(APIModel):
    page: int = 1
    total_pages: int
    total_results: int
    """
    results = ma.Method("get_results")

    def get_results(self, search_results):
        res = []
        for media in search_results["results"]:
            if media["media_type"] == "movie":
                res.append(tmdb_movie_serializer.dump(media))
            elif media["media_type"] == "tv":
                res.append(tmdb_series_serializer.dump(media))
            else:
                continue
        return res
"""


class TmdbMovieSearchResult(TmdbMediaSearchResult):
    results: List[TmdbMovie]


class TmdbSeriesSearchResultSchema(TmdbMediaSearchResult):
    results: List[TmdbSeries]
