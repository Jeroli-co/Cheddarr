from server.helpers import url

from ..urls import providers_bp
from . import views

# Radarr config management
url(providers_bp, views.get_radarr_status, ["/radarr/status/"], methods=["GET"])
url(providers_bp, views.test_radarr_config, ["/radarr/config/test/"], methods=["POST"])
url(providers_bp, views.get_radarr_config, ["/radarr/config/"], methods=["GET"])
url(providers_bp, views.update_radarr_config, ["/radarr/config/"], methods=["PATCH"])
