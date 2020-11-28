from typing import Union

import requests

from server import schemas
from server.models import MovieRequest, RadarrConfig, RequestStatus
from server.core import utils


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
    port = port
    if version == 2:
        version = None
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
    url = make_url(
        api_key=api_key, host=host, port=port, ssl=ssl, resource_path="/system/status"
    )
    try:
        r = requests.get(url)
    except Exception:
        return False
    if r.status_code != 200:
        return False
    return r.json()


def lookup(config: RadarrConfig, tmdb_id: int, title: str) -> schemas.RadarrMovie:
    url = make_url(
        api_key=config.api_key,
        host=config.host,
        port=config.port,
        ssl=config.ssl,
        version=config.version,
        resource_path="/movie/lookup",
        queries={"term": title},
    )
    lookup_result = requests.get(url).json()
    movie = next(res for res in lookup_result if res["tmdbId"] == tmdb_id)
    return schemas.RadarrMovie.parse_obj(movie)


def add_movie(config: RadarrConfig, movie: schemas.RadarrMovie):
    url = make_url(
        api_key=config.api_key,
        host=config.host,
        port=config.port,
        ssl=config.ssl,
        version=config.version,
        resource_path="/movie",
    )
    requests.post(url, data=movie.json(by_alias=True, exclude_none=True))


def send_request(request: MovieRequest):
    config = request.selected_provider
    movie = lookup(config, tmdb_id=request.movie.tmdb_id, title=request.movie.title)
    if movie.id is not None:
        request.status = RequestStatus.available
        return
    movie.root_folder_path = config.root_folder
    movie.quality_profile_id = config.quality_profile_id
    movie.add_options = schemas.RadarrAddOptions(search_for_movie=False)
    add_movie(config, movie)
