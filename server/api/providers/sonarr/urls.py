from server.helpers import url

from .. import providers
from . import views

# Sonarr config management
url(providers, views.get_sonarr_status, ["/sonarr/status/"], methods=["GET"])
url(providers, views.test_sonarr_config, ["/sonarr/config/test/"], methods=["POST"])
url(providers, views.get_sonarr_config, ["/sonarr/config/"], methods=["GET"])
url(providers, views.update_sonarr_config, ["/sonarr/config/"], methods=["PATCH"])
