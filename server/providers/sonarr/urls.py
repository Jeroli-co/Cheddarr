from server.helpers import url
from . import sonarr

# Sonarr config management
url(sonarr, "get_sonarr_status", ["/status/"], methods=["GET"])
url(sonarr, "test_sonarr_config", ["/config/test/"], methods=["POST"])
url(sonarr, "get_sonarr_config", ["/config/"], methods=["GET"])
url(sonarr, "update_sonarr_config", ["/config/"], methods=["PATCH"])
