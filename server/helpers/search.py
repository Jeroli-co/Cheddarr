import re
from typing import List, Optional, Union

import tmdbsimple as tmdb

from server import schemas
from server.core import config
from server.models import MediaType, SeriesType

tmdb.API_KEY = config.TMDB_API_KEY


def search_tmdb_media(
    term: str, page: int
) -> (List[Union[schemas.TmdbMovie, schemas.TmdbSeries]], int, int):
    search = tmdb.Search().multi(query=term, page=page)
    results = []
    for media in search["results"]:
        if media["media_type"] == "tv":
            set_tmdb_series_info(media, from_search=True)
            if not media["tvdb_id"]:
                continue
            parsed_media = schemas.TmdbSeries.parse_obj(media)
        elif media["media_type"] == "movie":
            set_tmdb_movie_info(media, from_search=True)
            parsed_media = schemas.TmdbMovie.parse_obj(media)
        else:
            continue
        results.append(parsed_media)
    return results, search["total_pages"], search["total_results"]


def search_tmdb_movies(term: str, page: int) -> (List[schemas.TmdbMovie], int, int):
    search = tmdb.Search().movie(query=term, page=page)
    results = []
    for movie in search["results"]:
        set_tmdb_movie_info(movie, from_search=True)
        parsed_movie = schemas.TmdbMovie.parse_obj(movie)
        results.append(parsed_movie)
    return results, search["total_pages"], search["total_results"]


def search_tmdb_series(term: str, page: int) -> (List[schemas.TmdbSeries], int, int):
    search = tmdb.Search().tv(query=term, page=page)
    results = []
    for series in search["results"]:
        set_tmdb_series_info(series, from_search=True)
        if not series["tvdb_id"]:
            continue
        parsed_media = schemas.TmdbSeries.parse_obj(series)
        results.append(parsed_media)
    return results, search["total_pages"], search["total_results"]


def find_tmdb_movie(tmdb_id: int) -> Optional[schemas.TmdbMovie]:
    try:
        movie = tmdb.Movies(tmdb_id).info(append_to_response="external_ids")
    except Exception:
        return None
    set_tmdb_movie_info(movie)
    return schemas.TmdbMovie.parse_obj(movie)


def find_tmdb_series(tmdb_id: int) -> Optional[schemas.TmdbSeries]:
    try:
        series = tmdb.TV(tmdb_id).info(append_to_response="external_ids")
    except Exception:
        return None
    set_tmdb_series_info(series)
    return schemas.TmdbSeries.parse_obj(series)


def find_tmdb_season(tmdb_id: int, season_number: int) -> Optional[schemas.TmdbSeason]:
    try:
        season = tmdb.TV_Seasons(tmdb_id, season_number).info(append_to_response="external_ids")
    except Exception:
        return None
    return schemas.TmdbSeason.parse_obj(season)


def find_tmdb_episode(
    tmdb_id: int, season_number: int, episode_number: int
) -> Optional[schemas.TmdbEpisode]:
    try:
        episode = tmdb.TV_Episodes(tmdb_id, season_number, episode_number).info(
            append_to_response="external_ids"
        )
    except Exception:
        return None
    return schemas.TmdbEpisode.parse_obj(episode)


def set_tmdb_movie_info(movie: dict, from_search: bool = False):
    movie["media_type"] = MediaType.movies
    if from_search:
        tmdb_genres = tmdb.Genres().movie_list().get("genres")
        genres = [genre["name"] for genre in tmdb_genres if genre["id"] in movie["genre_ids"]]
    else:
        genres = [genre["name"] for genre in movie["genres"]]
    movie["genres"] = genres


def set_tmdb_series_info(series: dict, from_search: bool = False):
    series["media_type"] = MediaType.series
    series["tvdb_id"] = tmdb.TV(series["id"]).external_ids().get("tvdb_id")
    series["series_type"] = SeriesType.standard
    anime_pattern = re.compile("^(?i)anim(e|ation)$")
    if from_search:
        tmdb_genres = tmdb.Genres().tv_list().get("genres")
        genres = [genre["name"] for genre in tmdb_genres if genre["id"] in series["genre_ids"]]
    else:
        genres = [genre["name"] for genre in series["genres"]]
    for genre in genres:
        if anime_pattern.match(genre):
            series["series_type"] = SeriesType.anime
            break
    series["genres"] = genres
