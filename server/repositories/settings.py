from typing import Any, Dict, Union

from pydantic import BaseModel
from sqlalchemy import update

from server.models.settings import (
    MediaProviderSetting,
    MediaServerSetting,
    PlexSetting,
    RadarrSetting,
    SonarrSetting,
)
from server.repositories.base import BaseRepository


class MediaProviderSettingRepository(BaseRepository[MediaProviderSetting]):
    async def save(self, db_obj: MediaProviderSetting) -> MediaProviderSetting:
        await super().save(db_obj)
        if db_obj.is_default:
            await self.execute(
                update(self.model)
                .where(
                    self.model.provider_type == db_obj.provider_type, self.model.id != db_obj.id
                )
                .values(is_default=False)
            )
            await super().save(db_obj)
        return db_obj

    async def update(
        self,
        db_obj: MediaProviderSetting,
        obj_in: Union[BaseModel, Dict[str, Any]],
    ) -> MediaProviderSetting:

        db_obj = await super().update(db_obj, obj_in)
        if db_obj.is_default:
            await self.execute(
                update(self.model)
                .where(self.model.provider_type == db_obj.provider_type, id != db_obj.id)
                .values(is_default=False)
            )
            await super().save(db_obj)
        return db_obj


class MediaServerSettingRepository(BaseRepository[MediaServerSetting]):
    pass


class PlexSettingRepository(MediaServerSettingRepository, BaseRepository[PlexSetting]):
    pass


class RadarrSettingRepository(MediaProviderSettingRepository, BaseRepository[RadarrSetting]):
    pass


class SonarrSettingRepository(MediaProviderSettingRepository, BaseRepository[SonarrSetting]):
    pass
