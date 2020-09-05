from server.helpers import url

from . import plex

# Plex config management
url(plex, "get_plex_status", ["/status/"], methods=["GET"])
url(plex, "get_plex_servers", ["/servers/"], methods=["GET"])
url(plex, "get_plex_config", ["/config/"], methods=["GET"])
url(plex, "update_plex_config", ["/config/"], methods=["PATCH"])
url(plex, "unlink_plex_account", ["/config/"], methods=["DELETE"])
url(plex, "add_plex_server", ["/config/servers/"], methods=["POST"])
url(plex, "remove_plex_server", ["/config/servers/<machine_id>/"], methods=["DELETE"])


# Plex medias
url(plex, "get_recent_movies", ["/movies/recent/"], methods=["GET"])
url(plex, "get_recent_series", ["/series/recent/"], methods=["GET"])
url(plex, "get_movie", ["/movies/<movie_id>/"], methods=["GET"])
url(plex, "get_series", ["/series/<series_id>/"], methods=["GET"])
url(
    plex,
    "get_season",
    ["/series/<series_id>/seasons/<season_number>/"],
    methods=["GET"],
)
url(
    plex,
    "get_episode",
    ["/series/<series_id>/seasons/<season_number>/episodes/<episode_number>/"],
    methods=["GET"],
)
url(plex, "get_on_deck", ["/onDeck/"], methods=["GET"])
