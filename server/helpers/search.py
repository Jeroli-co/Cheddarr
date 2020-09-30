import re
from typing import List, Union

import tmdbsimple as tmdb
from flask_login import current_user
from werkzeug.exceptions import BadRequest

from server.extensions import cache
from server.helpers.providers.plex import connect_plex_servers, plex_search
from server.models.requests import SeriesType
from server.models.users import User


def search_friends(name, limit=3):
    result = []
    search = User.search("username", name)
    current_friends = current_user.friends
    for user in search:
        if user in current_friends:
            result.append(user)
    return result


def search_media(title, section=None, filters=None):
    filters = filters or {}
    try:
        plex_server = connect_plex_servers(current_user)
    except BadRequest:
        return []
    result = plex_search(
        plex_server, section_type=section, title=title, filters=filters
    )
    return result


@cache.cached(timeout=40000)
def tmdb_series_genres():
    return tmdb.Genres().tv_list().get("genres")


@cache.cached(timeout=40000)
def tmdb_movie_genres():
    return tmdb.Genres().movie_list().get("genres")


def set_tmdb_series_info(series: Union[List[dict], dict]):
    anime_pattern = re.compile("^(?i)anim(e|ation)$")

    if isinstance(series, list):
        genres = tmdb_series_genres()
        anime_genre_ids = [
            genre["id"] for genre in genres if anime_pattern.match(genre["name"])
        ]
        for s in series:
            if s.get("media_type") == "tv":
                s["tvdb_id"] = tmdb.TV(s["id"]).external_ids().get("tvdb_id")
                s["series_type"] = (
                    "anime"
                    if not set(s["genre_ids"]).isdisjoint(anime_genre_ids)
                    else "standard"
                )
    else:
        series["tvdb_id"] = tmdb.TV(series["id"]).external_ids().get("tvdb_id")
        for genre in series["genres"]:
            if anime_pattern.match(genre["name"]):
                series["series_type"] = SeriesType.ANIME.value
                return
        series["series_type"] = SeriesType.STANDARD.value
