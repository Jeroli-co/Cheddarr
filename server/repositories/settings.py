from typing import Any, Dict, Union

from pydantic import BaseModel

from server.models.settings import (
    MediaProviderSetting,
    MediaServerSetting,
    PlexSetting,
    RadarrSetting,
    SonarrSetting,
)
from server.repositories.base import BaseRepository


class MediaProviderSettingRepository(BaseRepository[MediaProviderSetting]):
    def save(self, db_obj: MediaProviderSetting) -> MediaProviderSetting:
        db_obj = super().save(db_obj)
        if db_obj.is_default:
            self.session.query(self.model).filter(
                self.model.provider_type == db_obj.provider_type, self.model.id != db_obj.id
            ).update(dict(is_default=False))
            self.session.commit()
        return db_obj

    def update(
        self,
        db_obj: MediaProviderSetting,
        obj_in: Union[BaseModel, Dict[str, Any]],
    ) -> MediaProviderSetting:

        db_obj = super().update(db_obj, obj_in)
        if db_obj.is_default:
            self.session.query(self.model).filter(
                self.model.provider_type == db_obj.provider_type, id != db_obj.id
            ).update(dict(is_default=False))
        return db_obj


class MediaServerSettingRepository(BaseRepository[MediaServerSetting]):
    pass


class PlexSettingRepository(MediaServerSettingRepository, BaseRepository[PlexSetting]):
    pass


class RadarrSettingRepository(MediaProviderSettingRepository, BaseRepository[RadarrSetting]):
    pass


class SonarrSettingRepository(MediaProviderSettingRepository, BaseRepository[SonarrSetting]):
    pass
