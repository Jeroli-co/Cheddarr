from server.utils import make_url


def sonarr_url(config_dict, resource_path, queries=None) -> str:
    queries = queries or {}
    port = config_dict.get("port")
    return make_url(
        "%s://%s%s/api%s%s"
        % (
            "https" if config_dict.get("ssl") else "http",
            config_dict.get("host"),
            f":{port}" if port else "",
            "/v3" if config_dict.get("v3") else "",
            resource_path,
        ),
        queries_dict={**queries, "apikey": config_dict["api_key"]},
    )
