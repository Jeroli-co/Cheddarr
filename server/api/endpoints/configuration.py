from typing import List

import requests
from fastapi import APIRouter, Depends, HTTPException, status

from server.api import dependencies as deps
from server import schemas
from server.helpers import plex, radarr, sonarr
from server.models import PlexConfig, RadarrConfig, SonarrConfig, User
from server.repositories import (
    PlexConfigRepository,
    RadarrConfigRepository,
    SonarrConfigRepository,
)

router = APIRouter()

##########################################
# Plex                                   #
##########################################


@router.get("/plex", response_model=List[schemas.PlexConfig])
def get_plex_configs(
    current_user: User = Depends(deps.get_current_user),
    plex_config_repo: PlexConfigRepository = Depends(
        deps.get_repository(PlexConfigRepository)
    ),
):
    configs = plex_config_repo.find_all_by_user_id(user_id=current_user.id)
    return configs


@router.post(
    "/plex",
    response_model=schemas.PlexConfig,
    status_code=status.HTTP_201_CREATED,
    responses={
        status.HTTP_409_CONFLICT: {"description": "Server already added"},
        status.HTTP_503_SERVICE_UNAVAILABLE: {"description": "Server connection fail"},
    },
)
def add_plex_config(
    config_in: schemas.PlexConfigCreateUpdate,
    current_user: User = Depends(deps.get_current_user),
    plex_config_repo: PlexConfigRepository = Depends(
        deps.get_repository(PlexConfigRepository)
    ),
):
    if plex.get_server(config_in.api_key, name=config_in.server_name) is None:
        raise HTTPException(
            status.HTTP_503_SERVICE_UNAVAILABLE,
            "Failed to connect to  the Plex server.",
        )
    config = plex_config_repo.find_by_user_id_and_server_id(
        user_id=current_user.id, server_id=config_in.server_id
    )
    if config is not None:
        raise HTTPException(status.HTTP_409_CONFLICT, "This server is already added.")
    config = config_in.to_orm(PlexConfig)
    config.user_id = current_user.id
    config = plex_config_repo.save(config)
    return config


@router.put(
    "/plex/{config_id}",
    response_model=schemas.PlexConfig,
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "No Plex config"},
        status.HTTP_503_SERVICE_UNAVAILABLE: {"description": "Server connection fail"},
    },
)
def update_plex_config(
    config_id: str,
    config_in: schemas.PlexConfigCreateUpdate,
    current_user: User = Depends(deps.get_current_user),
    plex_config_repo: PlexConfigRepository = Depends(
        deps.get_repository(PlexConfigRepository)
    ),
):
    config = plex_config_repo.find_by_id(config_id)
    if config is None or config.user_id != current_user.id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Plex config not found.")
    if plex.get_server(config_in.api_key, config_in.server_name) is None:
        raise HTTPException(
            status.HTTP_503_SERVICE_UNAVAILABLE,
            "Failed to connect to  the Plex server.",
        )
    config.update(config_in)
    plex_config_repo.save(config)
    return config


@router.delete(
    "/plex/{config_id}",
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "No Plex config"},
    },
)
def delete_plex_config(
    config_id: str,
    current_user: User = Depends(deps.get_current_user),
    plex_config_repo: PlexConfigRepository = Depends(
        deps.get_repository(PlexConfigRepository)
    ),
):
    config = plex_config_repo.find_by_id(config_id)
    if config is None or config.user_id != current_user.id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Plex config not found.")
    plex_config_repo.remove(config)
    return {"detail": "Plex config removed."}


##########################################
# Radarr                                 #
##########################################


@router.post(
    "/radarr/instance-info",
    response_model=schemas.RadarrInstanceInfo,
    responses={
        status.HTTP_503_SERVICE_UNAVAILABLE: {"description": "Instance connection fail"}
    },
)
def get_radarr_instance_info(
    config_in: schemas.ProviderConfigBase,
):
    base_url = dict(
        api_key=config_in.api_key,
        host=config_in.host,
        port=config_in.port,
        ssl=config_in.ssl,
    )
    test = radarr.check_instance_status(**base_url)
    if not test:
        raise HTTPException(
            status.HTTP_503_SERVICE_UNAVAILABLE, "Failed to connect to Radarr."
        )
    version = int(test["version"][0])

    root_folders = [
        folder["path"]
        for folder in requests.get(
            radarr.make_url(**base_url, resource_path="/rootFolder")
        ).json()
    ]
    quality_profiles = [
        {"id": profile["id"], "name": profile["name"]}
        for profile in requests.get(
            radarr.make_url(**base_url, resource_path="/profile")
        ).json()
    ]
    return schemas.RadarrInstanceInfo(
        version=version, root_folders=root_folders, quality_profiles=quality_profiles
    )


@router.get("/radarr", response_model=schemas.RadarrConfig)
def get_radarr_configs(
    current_user: User = Depends(deps.get_current_user),
    radarr_config_repo: RadarrConfigRepository = Depends(
        deps.get_repository(RadarrConfigRepository)
    ),
):
    config = radarr_config_repo.find_all_by_user_id(current_user.id)
    return config


@router.post(
    "/radarr",
    response_model=schemas.RadarrConfig,
    responses={
        status.HTTP_503_SERVICE_UNAVAILABLE: {"description": "Instance connection fail"}
    },
)
def add_radarr_config(
    config_in: schemas.RadarrConfigCreateUpdate,
    current_user: User = Depends(deps.get_current_user),
    radarr_config_repo: RadarrConfigRepository = Depends(
        deps.get_repository(RadarrConfigRepository)
    ),
):
    if not radarr.check_instance_status(
        api_key=config_in.api_key,
        host=config_in.host,
        port=config_in.port,
        ssl=config_in.ssl,
    ):
        raise HTTPException(
            status.HTTP_503_SERVICE_UNAVAILABLE, "Failed to connect to Radarr."
        )
    config = config_in.to_orm(RadarrConfig)
    config.user_id = current_user.id
    config = radarr_config_repo.save(config)
    return config


@router.put(
    "/radarr/{config_id}",
    response_model=schemas.RadarrConfig,
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "Config not found"},
        status.HTTP_503_SERVICE_UNAVAILABLE: {
            "description": "Instance connection fail"
        },
    },
)
def update_radarr_config(
    config_id: str,
    config_in: schemas.RadarrConfigCreateUpdate,
    current_user: User = Depends(deps.get_current_user),
    radarr_config_repo: RadarrConfigRepository = Depends(
        deps.get_repository(RadarrConfigRepository)
    ),
):
    config = radarr_config_repo.find_by_id(config_id)
    if config is None or config.user_id != current_user.id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No existing Radarr config.")

    if not radarr.check_instance_status(
        api_key=config_in.api_key,
        host=config_in.host,
        port=config_in.port,
        ssl=config_in.ssl,
    ):
        raise HTTPException(
            status.HTTP_503_SERVICE_UNAVAILABLE, "Failed to connect to Radarr."
        )
    config.update(config_in)
    radarr_config_repo.save(config)
    return config


@router.delete(
    "/radarr/{config_id}",
    responses={status.HTTP_404_NOT_FOUND: {"description": "No Radarr config"}},
)
def delete_radarr_config(
    config_id: str,
    current_user: User = Depends(deps.get_current_user),
    radarr_config_repo: RadarrConfigRepository = Depends(
        deps.get_repository(RadarrConfigRepository)
    ),
):
    config = radarr_config_repo.find_by_id(config_id)
    if config is None or config.user_id != current_user.id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Radarr config not found.")
    radarr_config_repo.remove(config)
    return {"detail": "Radarr config removed."}


##########################################
# Sonarr                                 #
##########################################


@router.post(
    "/sonarr/instance-info",
    response_model=schemas.SonarrInstanceInfo,
    responses={
        status.HTTP_503_SERVICE_UNAVAILABLE: {"description": "Instance connection fail"}
    },
)
def get_sonarr_instance_info(config_in: schemas.ProviderConfigBase):
    base_url = dict(
        api_key=config_in.api_key,
        host=config_in.host,
        port=config_in.port,
        ssl=config_in.ssl,
    )
    test = sonarr.check_instance_status(**base_url)
    if not test:
        raise HTTPException(
            status.HTTP_503_SERVICE_UNAVAILABLE, "Failed to connect to Sonarr."
        )

    version = int(test["version"][0])
    root_folders = [
        folder["path"]
        for folder in requests.get(
            sonarr.make_url(**base_url, resource_path="/rootFolder")
        ).json()
    ]
    if version == 3:
        quality_profiles = [
            {"id": profile["id"], "name": profile["name"]}
            for profile in requests.get(
                sonarr.make_url(**base_url, version=3, resource_path="/qualityprofile")
            ).json()
        ]
        language_profiles = [
            {"id": profile["id"], "name": profile["name"]}
            for profile in requests.get(
                sonarr.make_url(**base_url, version=3, resource_path="/languageprofile")
            ).json()
        ]
    else:
        quality_profiles = [
            {"id": profile["id"], "name": profile["name"]}
            for profile in requests.get(
                sonarr.make_url(**base_url, resource_path="/profile")
            ).json()
        ]
        language_profiles = None

    return schemas.SonarrInstanceInfo(
        version=version,
        root_folders=root_folders,
        quality_profiles=quality_profiles,
        language_profiles=language_profiles,
    )


@router.get("/sonarr", response_model=List[schemas.SonarrConfig])
def get_sonarr_configs(
    current_user: User = Depends(deps.get_current_user),
    sonarr_config_repo: SonarrConfigRepository = Depends(
        deps.get_repository(SonarrConfigRepository)
    ),
):
    config = sonarr_config_repo.find_all_by_user_id(current_user.id)
    return config


@router.post(
    "/sonarr",
    response_model=schemas.SonarrConfig,
    responses={
        status.HTTP_503_SERVICE_UNAVAILABLE: {"description": "Instance connection fail"}
    },
)
def add_sonarr_config(
    config_in: schemas.SonarrConfigCreateUpdate,
    current_user: User = Depends(deps.get_current_user),
    sonarr_config_repo: SonarrConfigRepository = Depends(
        deps.get_repository(SonarrConfigRepository)
    ),
):
    if not sonarr.check_instance_status(
        api_key=config_in.api_key,
        host=config_in.host,
        port=config_in.port,
        ssl=config_in.ssl,
    ):
        raise HTTPException(
            status.HTTP_503_SERVICE_UNAVAILABLE, "Failed to connect to Sonarr."
        )
    config = config_in.to_orm(SonarrConfig)
    config.user_id = current_user.id
    sonarr_config_repo.save(config)
    return config


@router.put(
    "/sonarr/{config_id}",
    response_model=schemas.SonarrConfig,
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "Config not found"},
        status.HTTP_503_SERVICE_UNAVAILABLE: {
            "description": "Instance connection fail"
        },
    },
)
def update_sonarr_config(
    config_id: str,
    config_in: schemas.SonarrConfigCreateUpdate,
    current_user: User = Depends(deps.get_current_user),
    sonarr_config_repo: SonarrConfigRepository = Depends(
        deps.get_repository(SonarrConfigRepository)
    ),
):
    config = sonarr_config_repo.find_by_id(config_id)
    if config is None or config.user_id != current_user.id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No existing Sonarr config.")

    if not sonarr.check_instance_status(
        api_key=config_in.api_key,
        host=config_in.host,
        port=config_in.port,
        ssl=config_in.ssl,
    ):
        raise HTTPException(
            status.HTTP_503_SERVICE_UNAVAILABLE, "Failed to connect to Sonarr."
        )

    config.update(config_in)
    sonarr_config_repo.save(config)
    return config


@router.delete(
    "/sonarr/{config_id}",
    responses={status.HTTP_404_NOT_FOUND: {"description": "No Sonarr config"}},
)
def delete_sonarr_config(
    config_id: str,
    current_user: User = Depends(deps.get_current_user),
    sonarr_config_repo: SonarrConfigRepository = Depends(
        deps.get_repository(SonarrConfigRepository)
    ),
):
    config = sonarr_config_repo.find_by_id(config_id)
    if config is None or config.user_id != current_user.id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Sonarr config not found.")
    sonarr_config_repo.remove(config)
    return {"detail": "Sonarr config removed."}
