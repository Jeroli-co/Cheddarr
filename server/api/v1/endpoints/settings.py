from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status

from server import models, schemas
from server.api import dependencies as deps
from server.helpers import plex, radarr, sonarr
from server.repositories import (
    PlexSettingRepository,
    RadarrSettingRepository,
    SonarrSettingRepository,
)

router = APIRouter()


##########################################
# All providers                          #
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


@router.get("/plex", response_model=List[schemas.PlexSetting])
def get_plex_settings(
    current_user: models.User = Depends(deps.get_current_user),
    plex_setting_repo: PlexSettingRepository = Depends(deps.get_repository(PlexSettingRepository)),
):
    settings = plex_setting_repo.find_all_by(user_id=current_user.id)
    return settings


@router.post(
    "/plex",
    status_code=status.HTTP_201_CREATED,
    response_model=schemas.PlexSetting,
    responses={
        status.HTTP_409_CONFLICT: {"description": "Server already added"},
        status.HTTP_503_SERVICE_UNAVAILABLE: {"description": "Server connection fail"},
    },
)
def add_plex_setting(
    setting_in: schemas.PlexSettingCreateUpdate,
    current_user: models.User = Depends(deps.get_current_user),
    plex_setting_repo: PlexSettingRepository = Depends(deps.get_repository(PlexSettingRepository)),
):
    if (
        plex.get_server(
            base_url=setting_in.host,
            port=setting_in.port,
            ssl=setting_in.ssl,
            api_key=setting_in.api_key,
        )
        is None
    ):
        raise HTTPException(
            status.HTTP_503_SERVICE_UNAVAILABLE,
            "Failed to connect to  the Plex server.",
        )
    setting = plex_setting_repo.find_by(user_id=current_user.id, server_id=setting_in.server_id)
    if setting is not None:
        raise HTTPException(status.HTTP_409_CONFLICT, "This server is already added.")
    setting = setting_in.to_orm(models.PlexSetting)
    setting.user_id = current_user.id
    setting = plex_setting_repo.save(setting)
    return setting


@router.put(
    "/plex/{setting_id}",
    response_model=schemas.PlexSetting,
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "No Plex setting"},
        status.HTTP_503_SERVICE_UNAVAILABLE: {"description": "Server connection fail"},
    },
)
def update_plex_setting(
    setting_id: str,
    setting_in: schemas.PlexSettingCreateUpdate,
    current_user: models.User = Depends(deps.get_current_user),
    plex_setting_repo: PlexSettingRepository = Depends(deps.get_repository(PlexSettingRepository)),
):
    setting = plex_setting_repo.find_by(id=setting_id)
    if setting is None or setting.user_id != current_user.id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Plex setting not found.")
    if (
        plex.get_server(
            base_url=setting_in.host,
            port=setting_in.port,
            ssl=setting_in.ssl,
            api_key=setting_in.api_key,
        )
        is None
    ):
        raise HTTPException(
            status.HTTP_503_SERVICE_UNAVAILABLE,
            "Failed to connect to  the Plex server.",
        )
    setting.update(setting_in)
    plex_setting_repo.save(setting)
    return setting


@router.delete(
    "/plex/{setting_id}",
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "No Plex setting"},
    },
)
def delete_plex_setting(
    setting_id: str,
    current_user: models.User = Depends(deps.get_current_user),
    plex_setting_repo: PlexSettingRepository = Depends(deps.get_repository(PlexSettingRepository)),
):
    setting = plex_setting_repo.find_by(id=setting_id)
    if setting is None or setting.user_id != current_user.id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Plex setting not found.")
    plex_setting_repo.remove(setting)
    return {"detail": "Plex setting removed."}


##########################################
# Radarr                                 #
##########################################


@router.post(
    "/radarr/instance-info",
    response_model=schemas.RadarrInstanceInfo,
    responses={status.HTTP_503_SERVICE_UNAVAILABLE: {"description": "Instance connection fail"}},
    dependencies=[Depends(deps.get_current_poweruser)],
)
def get_radarr_instance_info(
    setting_in: schemas.ProviderSettingBase,
):
    instance_info = radarr.get_instance_info(
        setting_in.api_key, setting_in.host, setting_in.port, setting_in.ssl
    )
    if instance_info is None:
        raise HTTPException(status.HTTP_503_SERVICE_UNAVAILABLE, "Failed to connect to Radarr.")
    return instance_info


@router.get(
    "/radarr/{setting_id}/instance-info",
    response_model=schemas.RadarrInstanceInfo,
    dependencies=[Depends(deps.get_current_poweruser)],
)
def get_radarr_setting_instance_info(
    setting_id: str,
    radarr_setting_repo: RadarrSettingRepository = Depends(
        deps.get_repository(RadarrSettingRepository)
    ),
):
    setting = radarr_setting_repo.find_by(id=setting_id)
    if setting is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Radarr setting not found.")

    instance_info = radarr.get_instance_info(
        setting.api_key, setting.host, setting.port, setting.ssl
    )
    if instance_info is None:
        raise HTTPException(status.HTTP_503_SERVICE_UNAVAILABLE, "Failed to connect to Radarr.")
    return instance_info


@router.get("/radarr", response_model=List[schemas.RadarrSetting])
def get_radarr_settings(
    current_user: models.User = Depends(deps.get_current_poweruser),
    radarr_setting_repo: RadarrSettingRepository = Depends(
        deps.get_repository(RadarrSettingRepository)
    ),
):
    settings = radarr_setting_repo.find_all_by(user_id=current_user.id)
    return settings


@router.post(
    "/radarr",
    status_code=status.HTTP_201_CREATED,
    response_model=schemas.RadarrSetting,
    responses={status.HTTP_503_SERVICE_UNAVAILABLE: {"description": "Instance connection fail"}},
)
def add_radarr_setting(
    setting_in: schemas.RadarrSettingCreateUpdate,
    current_user: models.User = Depends(deps.get_current_poweruser),
    radarr_setting_repo: RadarrSettingRepository = Depends(
        deps.get_repository(RadarrSettingRepository)
    ),
):
    if not radarr.check_instance_status(
        api_key=setting_in.api_key,
        host=setting_in.host,
        port=setting_in.port,
        ssl=setting_in.ssl,
    ):
        raise HTTPException(status.HTTP_503_SERVICE_UNAVAILABLE, "Failed to connect to Radarr.")
    setting = setting_in.to_orm(models.RadarrSetting)
    setting.user_id = current_user.id
    setting = radarr_setting_repo.save(setting)
    return setting


@router.put(
    "/radarr/{setting_id}",
    response_model=schemas.RadarrSetting,
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "Setting not found"},
        status.HTTP_503_SERVICE_UNAVAILABLE: {"description": "Instance connection fail"},
    },
)
def update_radarr_setting(
    setting_id: str,
    setting_in: schemas.RadarrSettingCreateUpdate,
    current_user: models.User = Depends(deps.get_current_poweruser),
    radarr_setting_repo: RadarrSettingRepository = Depends(
        deps.get_repository(RadarrSettingRepository)
    ),
):
    setting = radarr_setting_repo.find_by(id=setting_id)
    if setting is None or setting.user_id != current_user.id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No existing Radarr setting.")

    if not radarr.check_instance_status(
        api_key=setting_in.api_key,
        host=setting_in.host,
        port=setting_in.port,
        ssl=setting_in.ssl,
    ):
        raise HTTPException(status.HTTP_503_SERVICE_UNAVAILABLE, "Failed to connect to Radarr.")
    setting.update(setting_in)
    radarr_setting_repo.save(setting)
    return setting


@router.delete(
    "/radarr/{setting_id}",
    responses={status.HTTP_404_NOT_FOUND: {"description": "No Radarr setting"}},
)
def delete_radarr_setting(
    setting_id: str,
    current_user: models.User = Depends(deps.get_current_poweruser),
    radarr_setting_repo: RadarrSettingRepository = Depends(
        deps.get_repository(RadarrSettingRepository)
    ),
):
    setting = radarr_setting_repo.find_by(id=setting_id)
    if setting is None or setting.user_id != current_user.id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Radarr setting not found.")
    radarr_setting_repo.remove(setting)
    return {"detail": "Radarr setting removed."}


##########################################
# Sonarr                                 #
##########################################


@router.post(
    "/sonarr/instance-info",
    response_model=schemas.SonarrInstanceInfo,
    responses={status.HTTP_503_SERVICE_UNAVAILABLE: {"description": "Instance connection fail"}},
    dependencies=[Depends(deps.get_current_poweruser)],
)
def get_sonarr_instance_info(
    setting_in: schemas.ProviderSettingBase,
):
    instance_info = sonarr.get_instance_info(
        setting_in.api_key, setting_in.host, setting_in.port, setting_in.ssl
    )
    if instance_info is None:
        raise HTTPException(status.HTTP_503_SERVICE_UNAVAILABLE, "Failed to connect to Sonarr.")
    return instance_info


@router.get(
    "/sonarr/{setting_id}/instance-info",
    response_model=schemas.SonarrInstanceInfo,
    dependencies=[Depends(deps.get_current_poweruser)],
)
def get_sonarr_setting_instance_info(
    setting_id: str,
    sonarr_setting_repo: SonarrSettingRepository = Depends(
        deps.get_repository(SonarrSettingRepository)
    ),
):
    setting = sonarr_setting_repo.find_by(id=setting_id)
    if setting is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Setting not found.")
    instance_info = sonarr.get_instance_info(
        setting.api_key, setting.host, setting.port, setting.ssl
    )
    if instance_info is None:
        raise HTTPException(status.HTTP_503_SERVICE_UNAVAILABLE, "Failed to connect to Sonarr.")
    return instance_info


@router.get("/sonarr", response_model=List[schemas.SonarrSetting])
def get_sonarr_settings(
    current_user: models.User = Depends(deps.get_current_poweruser),
    sonarr_setting_repo: SonarrSettingRepository = Depends(
        deps.get_repository(SonarrSettingRepository)
    ),
):
    settings = sonarr_setting_repo.find_all_by(user_id=current_user.id)
    return settings


@router.post(
    "/sonarr",
    status_code=status.HTTP_201_CREATED,
    response_model=schemas.SonarrSetting,
    responses={status.HTTP_503_SERVICE_UNAVAILABLE: {"description": "Instance connection fail"}},
)
def add_sonarr_setting(
    setting_in: schemas.SonarrSettingCreateUpdate,
    current_user: models.User = Depends(deps.get_current_poweruser),
    sonarr_setting_repo: SonarrSettingRepository = Depends(
        deps.get_repository(SonarrSettingRepository)
    ),
):
    if not sonarr.check_instance_status(
        api_key=setting_in.api_key,
        host=setting_in.host,
        port=setting_in.port,
        ssl=setting_in.ssl,
    ):
        raise HTTPException(status.HTTP_503_SERVICE_UNAVAILABLE, "Failed to connect to Sonarr.")
    setting = setting_in.to_orm(models.SonarrSetting)
    setting.user_id = current_user.id
    sonarr_setting_repo.save(setting)
    return setting


@router.put(
    "/sonarr/{setting_id}",
    response_model=schemas.SonarrSetting,
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "Setting not found"},
        status.HTTP_503_SERVICE_UNAVAILABLE: {"description": "Instance connection fail"},
    },
)
def update_sonarr_setting(
    setting_id: str,
    setting_in: schemas.SonarrSettingCreateUpdate,
    current_user: models.User = Depends(deps.get_current_poweruser),
    sonarr_setting_repo: SonarrSettingRepository = Depends(
        deps.get_repository(SonarrSettingRepository)
    ),
):
    setting = sonarr_setting_repo.find_by(id=setting_id)
    if setting is None or setting.user_id != current_user.id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No existing Sonarr setting.")

    if not sonarr.check_instance_status(
        api_key=setting_in.api_key,
        host=setting_in.host,
        port=setting_in.port,
        ssl=setting_in.ssl,
    ):
        raise HTTPException(status.HTTP_503_SERVICE_UNAVAILABLE, "Failed to connect to Sonarr.")

    setting.update(setting_in)
    sonarr_setting_repo.save(setting)
    return setting


@router.delete(
    "/sonarr/{setting_id}",
    responses={status.HTTP_404_NOT_FOUND: {"description": "No Sonarr setting"}},
)
def delete_sonarr_setting(
    setting_id: str,
    current_user: models.User = Depends(deps.get_current_poweruser),
    sonarr_setting_repo: SonarrSettingRepository = Depends(
        deps.get_repository(SonarrSettingRepository)
    ),
):
    setting = sonarr_setting_repo.find_by(id=setting_id)
    if setting is None or setting.user_id != current_user.id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Sonarr setting not found.")
    sonarr_setting_repo.remove(setting)
    return {"detail": "Sonarr setting removed."}