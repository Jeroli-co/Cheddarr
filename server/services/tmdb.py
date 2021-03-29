import re
from typing import List, Optional, Union

import tmdbsimple as tmdb

from server.core import config
from server.models.media import SeriesType
from server.schemas.media import TmdbEpisode, TmdbMovie, TmdbSeason, TmdbSeries

tmdb.API_KEY = config.TMDB_API_KEY


def search_tmdb_media(term: str, page: int) -> (List[Union[TmdbMovie, TmdbSeries]], int, int):
    search = tmdb.Search().multi(query=term, page=page, append_to_response="external_ids")
    results = []
    for media in search["results"]:
        if media["media_type"] == "tv":
            del media["media_type"]
            parsed_media = TmdbSeries.parse_obj(media)
        elif media["media_type"] == "movie":
            del media["media_type"]
            parsed_media = TmdbMovie.parse_obj(media)
        else:
            continue
        results.append(parsed_media)
    return results, search["total_pages"], search["total_results"]


def search_tmdb_movies(term: str, page: int) -> (List[TmdbMovie], int, int):
    search = tmdb.Search().movie(query=term, page=page)
    results = []
    for movie in search["results"]:
        parsed_movie = TmdbMovie.parse_obj(movie)
        results.append(parsed_movie)
    return results, search["total_pages"], search["total_results"]


def search_tmdb_series(term: str, page: int) -> (List[TmdbSeries], int, int):
    search = tmdb.Search().tv(query=term, page=page)
    results = []
    for series in search["results"]:
        parsed_media = TmdbSeries.parse_obj(series)
        results.append(parsed_media)
    return results, search["total_pages"], search["total_results"]


def get_tmdb_movie(tmdb_id: int) -> Optional[TmdbMovie]:
    try:
        movie = tmdb.Movies(tmdb_id).info(append_to_response="external_ids,credits,videos")
    except Exception:
        return None
    set_tmdb_movie_info(movie)
    return TmdbMovie.parse_obj(movie)


def get_tmdb_series(tmdb_id: int) -> Optional[TmdbSeries]:
    try:
        series = tmdb.TV(tmdb_id).info(append_to_response="external_ids,aggregate_credits,videos")
    except Exception:
        return None
    set_tmdb_series_info(series)
    return TmdbSeries.parse_obj(series)


def get_tmdb_season(tmdb_id: int, season_number: int) -> Optional[TmdbSeason]:
    try:
        season = tmdb.TV_Seasons(tmdb_id, season_number).info(
            append_to_response="external_ids,credits"
        )
    except Exception:
        return None
    return TmdbSeason.parse_obj(season)


def get_tmdb_episode(
    tmdb_id: int, season_number: int, episode_number: int
) -> Optional[TmdbEpisode]:
    try:
        episode = tmdb.TV_Episodes(tmdb_id, season_number, episode_number).info(
            append_to_response="external_ids,credits"
        )
    except Exception:
        return None
    return TmdbEpisode.parse_obj(episode)


def set_tmdb_movie_info(movie: dict):
    genres = [genre["name"] for genre in movie["genres"]]
    movie["genres"] = genres
    movie["videos"] = [
        video
        for video in movie["videos"]["results"]
        if video["type"] == "Trailer" and video["site"] == "YouTube"
    ]


def set_tmdb_series_info(series: dict):
    series["series_type"] = SeriesType.standard
    anime_pattern = re.compile("(?i)anim(e|ation)")
    genres = [genre["name"] for genre in series["genres"]]
    for genre in genres:
        if anime_pattern.match(genre):
            series["series_type"] = SeriesType.anime
            break
    series["genres"] = genres
    series["videos"] = [
        video
        for video in series["videos"]["results"]
        if video["type"] == "Trailer" and video["site"] == "YouTube"
    ]


def find_tmdb_id_from_external_id(imdb_id=None, tvdb_id=None) -> int:
    find = {}
    if imdb_id is not None:
        find = tmdb.Find(imdb_id).info(external_source="imdb_id")
    if tvdb_id is not None:
        find = tmdb.Find(tvdb_id).info(external_source="tvdb_id")
    tmdb_media = next((m[0] for m in find.values() if m), {})
    return tmdb_media.get("id")


def find_external_ids_from_tmdb_id(tmdb_id: int) -> dict:
    return tmdb.TV(tmdb_id).external_ids()


def get_tmdb_popular_movies(page: int = 1) -> (List[TmdbMovie], int, int):
    search = tmdb.Movies().popular(page=page)
    results = []

    for movie in search["results"]:
        parsed_movie = TmdbMovie.parse_obj(movie)
        results.append(parsed_movie)
    return results, search["total_pages"], search["total_results"]


def get_tmdb_upcoming_movies(page: int = 1) -> (List[TmdbMovie], int, int):
    search = tmdb.Movies().upcoming(page=page)
    results = []

    for movie in search["results"]:
        parsed_movie = TmdbMovie.parse_obj(movie)
        results.append(parsed_movie)
    return results, search["total_pages"], search["total_results"]


def get_tmdb_similar_movies(tmdb_id: int, page: int = 1) -> (List[TmdbMovie], int, int):
    search = tmdb.Movies(tmdb_id).similar_movies(page=page)
    results = []

    for movie in search["results"]:
        parsed_movie = TmdbMovie.parse_obj(movie)
        results.append(parsed_movie)
    return results, search["total_pages"], search["total_results"]


def get_tmdb_recommended_movies(tmdb_id: int, page: int = 1) -> (List[TmdbMovie], int, int):
    search = tmdb.Movies(tmdb_id).recommendations(page=page)
    results = []

    for movie in search["results"]:
        parsed_movie = TmdbMovie.parse_obj(movie)
        results.append(parsed_movie)
    return results, search["total_pages"], search["total_results"]


def get_tmdb_popular_series(page: int = 1) -> (List[TmdbSeries], int, int):
    search = tmdb.TV().popular(page=page)
    results = []

    for movie in search["results"]:
        parsed_movie = TmdbSeries.parse_obj(movie)
        results.append(parsed_movie)
    return results, search["total_pages"], search["total_results"]


def get_tmdb_similar_series(tmdb_id: int, page: int = 1) -> (List[TmdbSeries], int, int):
    search = tmdb.TV(tmdb_id).similar(page=page)
    results = []

    for movie in search["results"]:
        parsed_movie = TmdbSeries.parse_obj(movie)
        results.append(parsed_movie)
    return results, search["total_pages"], search["total_results"]


def get_tmdb_recommended_series(tmdb_id: int, page: int = 1) -> (List[TmdbSeries], int, int):
    search = tmdb.TV(tmdb_id).recommendations(page=page)
    results = []

    for movie in search["results"]:
        parsed_movie = TmdbSeries.parse_obj(movie)
        results.append(parsed_movie)
    return results, search["total_pages"], search["total_results"]
