from server.utils import make_url


def radarr_url(config_dict, resource_path, queries=None) -> str:
    queries = queries or {}
    port = config_dict.get("port")
    return make_url(
        "%s://%s%s/api%s"
        % (
            "https" if config_dict.get("ssl") else "http",
            config_dict.get("host"),
            f":{port}" if port else "",
            resource_path,
        ),
        queries_dict={**queries, "apikey": config_dict["api_key"]},
    )
