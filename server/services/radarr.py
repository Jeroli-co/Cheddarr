from typing import Any

from fastapi import HTTPException

from server.core import utils
from server.core.http_client import HttpClient
from server.models.requests import MediaRequest
from server.models.settings import RadarrSetting
from server.schemas.radarr import RadarrAddOptions, RadarrMovie
from server.schemas.settings import RadarrInstanceInfo


def make_url(
    *,
    api_key: str,
    host: str,
    port: int | None,
    ssl: bool,
    version: int | None = None,
    resource_path: str,
    queries: dict[str, Any] | None = None,
) -> str:
    queries = queries or {}
    return utils.make_url(
        "{}://{}{}/api{}{}".format(
            "https" if ssl else "http",
            host,
            f":{port}" if port else "",
            f"/v{version}" if version else "",
            resource_path,
        ),
        queries_dict={**queries, "apikey": api_key},
    )


async def check_instance_status(
    api_key: str,
    host: str,
    port: int | None,
    ssl: bool,
    version: int | None = None,
) -> dict[str, Any] | None:
    url = make_url(
        api_key=api_key,
        host=host,
        port=port,
        ssl=ssl,
        version=version,
        resource_path="/system/status",
    )
    try:
        resp = await HttpClient.get(url)
    except HTTPException:
        return None
    return resp


async def get_instance_info(
    api_key: str,
    host: str,
    port: int | None,
    ssl: bool,
    version: int | None = None,
) -> RadarrInstanceInfo | None:
    if not await check_instance_status(api_key=api_key, host=host, port=port, ssl=ssl, version=version):
        return None

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

    tags_url = make_url(
        api_key=api_key,
        host=host,
        port=port,
        ssl=ssl,
        version=3,
        resource_path="/tag",
    )

    root_folders = [folder["path"] for folder in await HttpClient.get(root_folders_url)]
    quality_profiles = [
        {"id": profile["id"], "name": profile["name"]} for profile in await HttpClient.get(quality_profiles_url)
    ]
    tags = [{"id": tag["id"], "name": tag["label"]} for tag in await HttpClient.get(tags_url)]

    return RadarrInstanceInfo(
        version=version,
        root_folders=root_folders,
        quality_profiles=quality_profiles,
        tags=tags,
    )


async def lookup(setting: RadarrSetting, tmdb_id: int | None = None, imdb_id: str | None = None) -> RadarrMovie | None:
    url = make_url(
        api_key=setting.api_key,
        host=setting.host,
        port=setting.port,
        ssl=setting.ssl,
        version=setting.version,
        resource_path="/movie/lookup",
        queries={"term": f"tmdb:{tmdb_id}" if tmdb_id else f"imdb:{imdb_id}"},
    )
    lookup_result = await HttpClient.get(url)
    if not isinstance(lookup_result, list) or len(lookup_result) == 0:
        return None
    return RadarrMovie.model_validate(lookup_result[0])


async def add_movie(setting: RadarrSetting, movie: RadarrMovie) -> RadarrMovie:
    url = make_url(
        api_key=setting.api_key,
        host=setting.host,
        port=setting.port,
        ssl=setting.ssl,
        version=setting.version,
        resource_path="/movie",
    )
    resp = await HttpClient.post(url, data=movie.model_dump_json(by_alias=True, exclude_none=True))
    return RadarrMovie.model_validate(resp)


async def send_request(request: MediaRequest) -> None:
    setting = RadarrSetting(**request.selected_provider.dict())
    movie = await lookup(
        setting,
        tmdb_id=request.media.tmdb_id,
        imdb_id=request.media.imdb_id,
    )
    if movie is None or movie.id is not None:
        return
    movie.root_folder_path = request.root_folder or setting.root_folder
    movie.quality_profile_id = request.quality_profile_id or setting.quality_profile_id
    movie.tags = request.tags or setting.tags
    movie.monitored = True
    movie.add_options = RadarrAddOptions(search_for_movie=True)
    await add_movie(setting, movie)
