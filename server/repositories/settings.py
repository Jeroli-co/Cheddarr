from __future__ import annotations

from typing import Any

import sqlalchemy as sa
from pydantic import BaseModel

from server.models.settings import (
    MediaProviderSetting,
    MediaServerSetting,
)
from server.repositories.base import BaseRepository


class MediaProviderSettingRepository(BaseRepository[MediaProviderSetting]):
    """Repository for MediaProviderSetting model."""

    async def save(self, db_obj: MediaProviderSetting) -> MediaProviderSetting:
        await super().save(db_obj)
        if db_obj.is_default:
            await self.session.execute(
                sa.update(self.model)
                .where(self.model.provider_type == db_obj.provider_type, self.model.id != db_obj.id)
                .values(is_default=False),
            )
            db_obj.is_default = True
            await super().save(db_obj)
        return db_obj

    async def update(
        self,
        db_obj: MediaProviderSetting,
        obj_in: BaseModel | dict[str, Any],
    ) -> MediaProviderSetting:
        await super().update(db_obj, obj_in)
        if db_obj.is_default:
            await self.session.execute(
                sa.update(self.model).where(self.model.provider_type == db_obj.provider_type).values(is_default=False),
            )
            db_obj.is_default = True
            await super().save(db_obj)
        return db_obj


class MediaServerSettingRepository(BaseRepository[MediaServerSetting]):
    ...
