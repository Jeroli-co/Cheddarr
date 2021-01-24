import re
from typing import Optional

import tmdbsimple as tmdb

from server import schemas
from server.core import settings
from server.models import MediaType, SeriesType

tmdb.API_KEY = settings.TMDB_API_KEY


def search_tmdb_media(term: str, page: int) -> dict:
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
    search["results"] = results
    return schemas.TmdbSearchResult.parse_obj(search).dict()


def search_tmdb_movies(term: str, page: int) -> dict:
    search = tmdb.Search().movie(query=term, page=page)
    results = []
    for movie in search["results"]:
        set_tmdb_movie_info(movie, from_search=True)
        parsed_movie = schemas.TmdbMovie.parse_obj(movie)
        results.append(parsed_movie)
    search["results"] = results
    return schemas.TmdbSearchResult.parse_obj(search).dict()


def search_tmdb_series(term: str, page: int) -> dict:
    search = tmdb.Search().tv(query=term, page=page)
    results = []
    for series in search["results"]:
        set_tmdb_series_info(series, from_search=True)
        if not series["tvdb_id"]:
            continue
        parsed_media = schemas.TmdbSeries.parse_obj(series)
        results.append(parsed_media)
    search["results"] = results
    return schemas.TmdbSearchResult.parse_obj(search).dict()


def find_tmdb_movie(tmdb_id: int) -> Optional[dict]:
    try:
        movie = tmdb.Movies(tmdb_id).info()
    except Exception:
        return None
    set_tmdb_movie_info(movie)
    return schemas.TmdbMovie.parse_obj(movie).dict()


def find_tmdb_series_by_tvdb_id(tvdb_id: int) -> Optional[dict]:
    tmdb_result = tmdb.Find(tvdb_id).info(external_source="tvdb_id").get("tv_results")
    if not tmdb_result:
        return None
    tmdb_id = tmdb_result[0]["id"]
    series = tmdb.TV(tmdb_id).info()
    set_tmdb_series_info(series)
    return schemas.TmdbSeries.parse_obj(series).dict()


def find_tmdb_season_by_tvdb_id(tvdb_id: int, season_number: int) -> Optional[dict]:
    tmdb_result = tmdb.Find(tvdb_id).info(external_source="tvdb_id").get("tv_results")
    if not tmdb_result:
        return None
    tmdb_id = tmdb_result[0]["id"]
    season = tmdb.TV_Seasons(tmdb_id, season_number).info()
    return schemas.TmdbSeason.parse_obj(season).dict()


def find_tmdb_episode_by_tvdb_id(
    tvdb_id: int, season_number: int, episode_number: int
) -> Optional[dict]:
    tmdb_result = tmdb.Find(tvdb_id).info(external_source="tvdb_id").get("tv_results")
    if not tmdb_result:
        return None
    tmdb_id = tmdb_result[0]["id"]
    episode = tmdb.TV_Episodes(tmdb_id, season_number, episode_number).info()
    return schemas.TmdbEpisode.parse_obj(episode).dict()


def set_tmdb_movie_info(movie: dict, from_search: bool = False):
    movie["media_type"] = MediaType.movies
    if from_search:
        tmdb_genres = tmdb.Genres().movie_list().get("genres")
        genres = [
            genre["name"] for genre in tmdb_genres if genre["id"] in movie["genre_ids"]
        ]
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
        genres = [
            genre["name"] for genre in tmdb_genres if genre["id"] in series["genre_ids"]
        ]
    else:
        genres = [genre["name"] for genre in series["genres"]]
    for genre in genres:
        if anime_pattern.match(genre):
            series["series_type"] = SeriesType.anime
            break
    series["genres"] = genres
