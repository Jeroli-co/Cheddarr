from server.helpers import url

from .. import providers
from . import views

# Radarr config management
url(providers, views.get_radarr_status, ["/radarr/status/"], methods=["GET"])
url(providers, views.test_radarr_config, ["/radarr/config/test/"], methods=["POST"])
url(providers, views.get_radarr_config, ["/radarr/config/"], methods=["GET"])
url(providers, views.update_radarr_config, ["/radarr/config/"], methods=["PATCH"])
