from typing import List, Optional, Type

from server.models import (
    PlexConfig,
    ProviderConfig,
    ProviderType,
    RadarrConfig,
    SonarrConfig,
)
from server.repositories.base import BaseRepository


class ProviderConfigRepository(BaseRepository[ProviderConfig]):
    """
    Repository that offers Polymorphically query access to the `ProviderConfig` subclasses
    """

    def find_by_user_id(
        self, user_id, enabled: bool = None
    ) -> Optional[Type[ProviderConfig]]:
        query = self.session.query(ProviderConfig).filter_by(user_id=user_id)
        if enabled is not None:
            query = query.filter_by(enabled=enabled)
        return query.one_or_none()

    def find_all_by_user_id(
        self, user_id: int, enabled: bool = None
    ) -> List[Type[ProviderConfig]]:
        query = self.session.query(ProviderConfig).filter_by(user_id=user_id)
        if enabled is not None:
            query = query.filter_by(enabled=enabled)
        return query.all()

    def find_all_by_user_id_and_type(
        self, user_id: int, provider_type: ProviderType, enabled: bool = None
    ) -> List[Type[ProviderConfig]]:
        query = self.session.query(ProviderConfig).filter_by(
            user_id=user_id, provider_type=provider_type, enabled=enabled
        )
        if enabled is not None:
            query = query.filter_by(enabled=enabled)
        return query.all()


class PlexConfigRepository(BaseRepository[PlexConfig]):
    def find_by_id(self, id: str) -> Optional[PlexConfig]:
        return self.session.query(PlexConfig).get(id)

    def find_by_user_id_and_server_id(
        self, user_id, server_id: str, enabled: bool = None
    ) -> Optional[PlexConfig]:
        query = self.session.query(PlexConfig).filter_by(
            user_id=user_id, server_id=server_id
        )
        if enabled is not None:
            query = query.filter_by(enabled=enabled)
        return query.one_or_none()

    def find_all_by_user_id(self, user_id, enabled: bool = None) -> List[PlexConfig]:
        query = self.session.query(PlexConfig).filter_by(user_id=user_id)
        if enabled is not None:
            query = query.filter_by(enabled=enabled)
        return query.all()


class RadarrConfigRepository(BaseRepository[RadarrConfig]):
    def find_by_id(self, id: str) -> Optional[RadarrConfig]:
        return self.session.query(RadarrConfig).get(id)

    def find_all_by_user_id(self, user_id, enabled: bool = None) -> List[RadarrConfig]:
        query = self.session.query(RadarrConfig).filter_by(user_id=user_id)
        if enabled is not None:
            query = query.filter_by(enabled=enabled)
        return query.one_or_none()


class SonarrConfigRepository(BaseRepository[SonarrConfig]):
    def find_by_id(self, id: str) -> Optional[SonarrConfig]:
        return self.session.query(SonarrConfig).get(id)

    def find_all_by_user_id(self, user_id, enabled: bool = None) -> List[SonarrConfig]:
        query = self.session.query(SonarrConfig).filter_by(user_id=user_id)
        if enabled is not None:
            query = query.filter_by(enabled=enabled)
        return query.one_or_none()
