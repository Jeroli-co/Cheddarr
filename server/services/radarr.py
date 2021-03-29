from typing import Optional, Union

import requests

from server.core import utils
from server.models.requests import MovieRequest
from server.models.settings import RadarrSetting
from server.schemas.external_services import RadarrAddOptions, RadarrMovie
from server.schemas.settings import RadarrInstanceInfo


def make_url(
    *,
    api_key: str,
    host: str,
    port: int,
    ssl: bool,
    version: int = 2,
    resource_path: str,
    queries: dict = None,
) -> str:
    queries = queries or {}
    version = version if version == 3 else None
    return utils.make_url(
        "%s://%s%s/api%s%s"
        % (
            "https" if ssl else "http",
            host,
            f":{port}" if port else "",
            f"/v{version}" if version else "",
            resource_path,
        ),
        queries_dict={**queries, "apikey": api_key},
    )


def check_instance_status(
    api_key: str,
    host: str,
    port: int,
    ssl: bool,
) -> Union[bool, dict]:
    url = make_url(api_key=api_key, host=host, port=port, ssl=ssl, resource_path="/system/status")
    try:
        r = requests.get(url)
    except Exception:
        return False
    if r.status_code != 200:
        return False
    return r.json()


def get_instance_info(
    api_key: str,
    host: str,
    port: int,
    ssl: bool,
) -> Optional[RadarrInstanceInfo]:

    test = check_instance_status(
        api_key=api_key,
        host=host,
        port=port,
        ssl=ssl,
    )
    if not test:
        return None
    version = int(test["version"][0])

    if version == 3:
        root_folders_url = make_url(
            api_key=api_key,
            host=host,
            port=port,
            ssl=ssl,
            version=3,
            resource_path="/rootFolder",
        )
        quality_profiles_url = make_url(
            api_key=api_key,
            host=host,
            port=port,
            ssl=ssl,
            version=3,
            resource_path="/qualityprofile",
        )
    else:
        root_folders_url = make_url(
            api_key=api_key, host=host, port=port, ssl=ssl, resource_path="/rootFolder"
        )
        quality_profiles_url = make_url(
            api_key=api_key, host=host, port=port, ssl=ssl, resource_path="/profile"
        )

    root_folders = [folder["path"] for folder in requests.get(root_folders_url).json()]
    quality_profiles = [
        {"id": profile["id"], "name": profile["name"]}
        for profile in requests.get(quality_profiles_url).json()
    ]
    return RadarrInstanceInfo(
        version=version, root_folders=root_folders, quality_profiles=quality_profiles
    )


def lookup(setting: RadarrSetting, tmdb_id: int, title: str) -> Optional[RadarrMovie]:
    url = make_url(
        api_key=setting.api_key,
        host=setting.host,
        port=setting.port,
        ssl=setting.ssl,
        version=setting.version,
        resource_path="/movie/lookup",
        queries={"term": title},
    )
    lookup_result = requests.get(url).json()
    if not isinstance(lookup_result, list):
        return None
    movie = next(res for res in lookup_result if res["tmdbId"] == tmdb_id)
    return RadarrMovie.parse_obj(movie)


def add_movie(setting: RadarrSetting, movie: RadarrMovie):
    url = make_url(
        api_key=setting.api_key,
        host=setting.host,
        port=setting.port,
        ssl=setting.ssl,
        version=setting.version,
        resource_path="/movie",
    )
    requests.post(url, data=movie.json(by_alias=True, exclude_none=True))


def send_request(request: MovieRequest):
    setting = request.selected_provider
    movie = lookup(setting, tmdb_id=request.media.tmdb_id, title=request.media.title)
    if movie is None or movie.id is not None:
        return
    movie.root_folder_path = setting.root_folder
    movie.quality_profile_id = setting.quality_profile_id
    movie.add_options = RadarrAddOptions(search_for_movie=True)
    add_movie(setting, movie)
