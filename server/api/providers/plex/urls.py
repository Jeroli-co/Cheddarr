from server.helpers import url

from .. import providers
from . import views

# Plex config management
url(providers, views.get_plex_status, ["/plex/status/"], methods=["GET"])
url(providers, views.get_plex_servers, ["/plex/servers/"], methods=["GET"])
url(providers, views.get_plex_config, ["/plex/config/"], methods=["GET"])
url(providers, views.update_plex_config, ["/plex/config/"], methods=["PATCH"])
url(providers, views.unlink_plex_account, ["/plex/config/"], methods=["DELETE"])
url(providers, views.add_plex_server, ["/plex/config/servers/"], methods=["POST"])
url(
    providers,
    views.remove_plex_server,
    ["/plex/config/servers/<machine_id>/"],
    methods=["DELETE"],
)


# Plex medias
url(providers, views.get_recent_movies, ["/plex/movies/recent/"], methods=["GET"])
url(providers, views.get_recent_series, ["/plex/series/recent/"], methods=["GET"])
url(providers, views.get_movie, ["/plex/movies/<movie_id>/"], methods=["GET"])
url(providers, views.get_series, ["/plex/series/<series_id>/"], methods=["GET"])
url(
    providers,
    views.get_season,
    ["/plex/series/<series_id>/seasons/<season_number>/"],
    methods=["GET"],
)
url(
    providers,
    views.get_episode,
    ["/plex/series/<series_id>/seasons/<season_number>/episodes/<episode_number>/"],
    methods=["GET"],
)
url(providers, views.get_on_deck, ["/plex/onDeck/"], methods=["GET"])
