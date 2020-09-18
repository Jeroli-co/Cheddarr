from requests import get
from server.utils import make_url


def sonarr_url(config_dict, resource_path, v3=False, queries=None) -> str:
    queries = queries or {}
    port = config_dict.get("port")
    return make_url(
        "%s://%s%s/api%s%s"
        % (
            "https" if config_dict.get("ssl") else "http",
            config_dict.get("host"),
            f":{port}" if port else "",
            "/v3" if v3 else "",
            resource_path,
        ),
        queries_dict={**queries, "apikey": config_dict["api_key"]},
    )


def test_sonarr_status(config):
    url = sonarr_url(config, "/system/status")
    try:
        r = get(url)
    except Exception:
        return False
    if r.status_code != 200:
        return False
    return r.json()
