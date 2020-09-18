from server.helpers import url

from ..urls import providers_bp
from . import views

# Sonarr config management
url(providers_bp, views.test_sonarr_config, ["/sonarr/config/test/"], methods=["PATCH"])
url(providers_bp, views.get_sonarr_config, ["/sonarr/config/"], methods=["GET"])
url(providers_bp, views.update_sonarr_config, ["/sonarr/config/"], methods=["PUT"])
url(
    providers_bp,
    views.sonarr_lookup,
    ["/sonarr/lookup/"],
    methods=["GET"],
)
