from server.utils import make_url


def sonarr_url(config_dict, resource_path, queries=None) -> str:
    queries = queries or {}
    return make_url(
        "%s://%s:%s/api%s"
        % (
            "https" if config_dict.get("ssl") else "http",
            config_dict.get("host"),
            config_dict.get("port"),
            resource_path,
        ),
        queries_dict={**queries, "apikey": config_dict["api_key"]},
    )
