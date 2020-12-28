from typing import Optional

import requests
from fastapi import APIRouter, Depends, HTTPException, status

from server import models, schemas
from server.api import dependencies as deps
from server.helpers import plex, radarr, sonarr
from server.repositories import (
    PlexConfigRepository,
    RadarrConfigRepository,
    SonarrConfigRepository,
)

router = APIRouter()


##########################################
# All configurations                     #
##########################################


@router.get("")
def get_user_providers(
    type: Optional[models.ProviderType] = None,
    current_user: models.User = Depends(deps.get_current_user),
):
    user_providers = current_user.providers
    if type is not None:
        return [
            provider
            for provider in user_providers
            if provider.provider_type == type and provider.enabled
        ]
    return user_providers


##########################################
# Plex                                   #
##########################################


@router.get("/plex", response_model=list[schemas.PlexConfig])
def get_plex_configs(
    current_user: models.User = Depends(deps.get_current_user),
    plex_config_repo: PlexConfigRepository = Depends(
        deps.get_repository(PlexConfigRepository)
    ),
):
    configs = plex_config_repo.find_all_by(user_id=current_user.id)
    return configs


@router.post(
    "/plex",
    status_code=status.HTTP_201_CREATED,
    response_model=schemas.PlexConfig,
    responses={
        status.HTTP_409_CONFLICT: {"description": "Server already added"},
        status.HTTP_503_SERVICE_UNAVAILABLE: {"description": "Server connection fail"},
    },
)
def add_plex_config(
    config_in: schemas.PlexConfigCreateUpdate,
    current_user: models.User = Depends(deps.get_current_user),
    plex_config_repo: PlexConfigRepository = Depends(
        deps.get_repository(PlexConfigRepository)
    ),
):
    if (
        plex.get_server(
            base_url=config_in.host,
            port=config_in.port,
            ssl=config_in.ssl,
            api_key=config_in.api_key,
        )
        is None
    ):
        raise HTTPException(
            status.HTTP_503_SERVICE_UNAVAILABLE,
            "Failed to connect to  the Plex server.",
        )
    config = plex_config_repo.find_by(
        user_id=current_user.id, server_id=config_in.server_id
    )
    if config is not None:
        raise HTTPException(status.HTTP_409_CONFLICT, "This server is already added.")
    config = config_in.to_orm(models.PlexConfig)
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
    current_user: models.User = Depends(deps.get_current_user),
    plex_config_repo: PlexConfigRepository = Depends(
        deps.get_repository(PlexConfigRepository)
    ),
):
    config = plex_config_repo.find_by(id=config_id)
    if config is None or config.user_id != current_user.id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Plex config not found.")
    if (
        plex.get_server(
            base_url=config_in.host,
            port=config_in.port,
            ssl=config_in.ssl,
            api_key=config_in.api_key,
        )
        is None
    ):
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
    current_user: models.User = Depends(deps.get_current_user),
    plex_config_repo: PlexConfigRepository = Depends(
        deps.get_repository(PlexConfigRepository)
    ),
):
    config = plex_config_repo.find_by(id=config_id)
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
    current_user=Depends(deps.get_current_poweruser),
):
    instance_info = radarr.get_instance_info(
        config_in.api_key, config_in.host, config_in.port, config_in.ssl
    )
    if instance_info is None:
        raise HTTPException(
            status.HTTP_503_SERVICE_UNAVAILABLE, "Failed to connect to Radarr."
        )
    return instance_info


@router.get("/radarr/{config_id}/instance-info")
def get_radarr_config_instance_info(
    config_id: str,
    current_user=Depends(deps.get_current_poweruser),
    radarr_config_repo: RadarrConfigRepository = Depends(
        deps.get_repository(RadarrConfigRepository)
    ),
):
    config = radarr_config_repo.find_by(id=config_id)
    if config is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Radarr config not found.")

    instance_info = radarr.get_instance_info(
        config.api_key, config.host, config.port, config.ssl
    )
    if instance_info is None:
        raise HTTPException(
            status.HTTP_503_SERVICE_UNAVAILABLE, "Failed to connect to Radarr."
        )
    return instance_info


@router.get("/radarr", response_model=list[schemas.RadarrConfig])
def get_radarr_configs(
    current_user: models.User = Depends(deps.get_current_poweruser),
    radarr_config_repo: RadarrConfigRepository = Depends(
        deps.get_repository(RadarrConfigRepository)
    ),
):
    configs = radarr_config_repo.find_all_by(user_id=current_user.id)
    return configs


@router.post(
    "/radarr",
    status_code=status.HTTP_201_CREATED,
    response_model=schemas.RadarrConfig,
    responses={
        status.HTTP_503_SERVICE_UNAVAILABLE: {"description": "Instance connection fail"}
    },
)
def add_radarr_config(
    config_in: schemas.RadarrConfigCreateUpdate,
    current_user: models.User = Depends(deps.get_current_poweruser),
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
    config = config_in.to_orm(models.RadarrConfig)
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
    current_user: models.User = Depends(deps.get_current_poweruser),
    radarr_config_repo: RadarrConfigRepository = Depends(
        deps.get_repository(RadarrConfigRepository)
    ),
):
    config = radarr_config_repo.find_by(id=config_id)
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
    current_user: models.User = Depends(deps.get_current_poweruser),
    radarr_config_repo: RadarrConfigRepository = Depends(
        deps.get_repository(RadarrConfigRepository)
    ),
):
    config = radarr_config_repo.find_by(id=config_id)
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
def get_sonarr_instance_info(
    config_in: schemas.ProviderConfigBase,
    current_user=Depends(deps.get_current_poweruser),
):
    instance_info = sonarr.get_instance_info(
        config_in.api_key, config_in.host, config_in.port, config_in.ssl
    )
    if instance_info is None:
        raise HTTPException(
            status.HTTP_503_SERVICE_UNAVAILABLE, "Failed to connect to Sonarr."
        )
    return instance_info


@router.get("/sonarr/{config_id}/instance-info")
def get_sonarr_config_instance_info(
    config_id: str,
    current_user=Depends(deps.get_current_poweruser),
    sonarr_config_repo: SonarrConfigRepository = Depends(
        deps.get_repository(SonarrConfigRepository)
    ),
):
    config = sonarr_config_repo.find_by(id=config_id)
    if config is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Config not found.")
    instance_info = sonarr.get_instance_info(
        config.api_key, config.host, config.port, config.ssl
    )
    if instance_info is None:
        raise HTTPException(
            status.HTTP_503_SERVICE_UNAVAILABLE, "Failed to connect to Sonarr."
        )
    return instance_info


@router.get("/sonarr", response_model=list[schemas.SonarrConfig])
def get_sonarr_configs(
    current_user: models.User = Depends(deps.get_current_poweruser),
    sonarr_config_repo: SonarrConfigRepository = Depends(
        deps.get_repository(SonarrConfigRepository)
    ),
):
    configs = sonarr_config_repo.find_all_by(user_id=current_user.id)
    return configs


@router.post(
    "/sonarr",
    status_code=status.HTTP_201_CREATED,
    response_model=schemas.SonarrConfig,
    responses={
        status.HTTP_503_SERVICE_UNAVAILABLE: {"description": "Instance connection fail"}
    },
)
def add_sonarr_config(
    config_in: schemas.SonarrConfigCreateUpdate,
    current_user: models.User = Depends(deps.get_current_poweruser),
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
    config = config_in.to_orm(models.SonarrConfig)
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
    current_user: models.User = Depends(deps.get_current_poweruser),
    sonarr_config_repo: SonarrConfigRepository = Depends(
        deps.get_repository(SonarrConfigRepository)
    ),
):
    config = sonarr_config_repo.find_by(id=config_id)
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
    current_user: models.User = Depends(deps.get_current_poweruser),
    sonarr_config_repo: SonarrConfigRepository = Depends(
        deps.get_repository(SonarrConfigRepository)
    ),
):
    config = sonarr_config_repo.find_by(id=config_id)
    if config is None or config.user_id != current_user.id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Sonarr config not found.")
    sonarr_config_repo.remove(config)
    return {"detail": "Sonarr config removed."}
