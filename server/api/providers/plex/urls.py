from server.helpers import url

from ..urls import providers_bp
from . import views

# Plex config management
url(providers_bp, views.get_plex_status, ["/plex/status/"], methods=["GET"])
url(providers_bp, views.get_plex_servers, ["/plex/servers/"], methods=["GET"])
url(providers_bp, views.get_plex_config, ["/plex/config/"], methods=["GET"])
url(providers_bp, views.update_plex_config, ["/plex/config/"], methods=["PATCH"])
url(providers_bp, views.unlink_plex_account, ["/plex/config/"], methods=["DELETE"])
url(providers_bp, views.add_plex_server, ["/plex/config/servers/"], methods=["POST"])
url(
    providers_bp,
    views.remove_plex_server,
    ["/plex/config/servers/<machine_id>/"],
    methods=["DELETE"],
)


# Plex medias
url(
    providers_bp,
    views.get_plex_recent_movies,
    ["/plex/movies/recent/"],
    methods=["GET"],
)
url(
    providers_bp,
    views.get_plex_recent_series,
    ["/plex/series/recent/"],
    methods=["GET"],
)
url(
    providers_bp,
    views.get_plex_movie,
    ["/plex/movies/<int:movie_id>/"],
    methods=["GET"],
)
url(
    providers_bp,
    views.get_plex_series,
    ["/plex/series/<int:series_id>/"],
    methods=["GET"],
)
url(
    providers_bp,
    views.get_plex_season,
    ["/plex/seasons/<int:season_id>/"],
    methods=["GET"],
)
url(
    providers_bp,
    views.get_plex_episode,
    ["/plex/episodes/<int:episode_id>/"],
    methods=["GET"],
)
url(providers_bp, views.get_plex_on_deck, ["/plex/onDeck/"], methods=["GET"])
