from server.helpers import url
from . import radarr

# Radarr config management
url(radarr, "get_radarr_status", ["/status/"], methods=["GET"])
url(radarr, "test_radarr_config", ["/config/test/"], methods=["POST"])
url(radarr, "get_radarr_config", ["/config/"], methods=["GET"])
url(radarr, "update_radarr_config", ["/config/"], methods=["PATCH"])
