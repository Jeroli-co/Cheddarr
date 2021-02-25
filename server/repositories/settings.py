from sqlalchemy import or_

from server.models import (
    PlexSetting,
    ExternalServiceSetting,
    ExternalServiceType,
    RadarrSetting,
    SonarrSetting,
)
from server.repositories.base import BaseRepository


class ExternalServiceSettingRepository(BaseRepository[ExternalServiceSetting]):
    def find_media_server_by(self, **filters):
        return (
            self.session.query(ExternalServiceSetting)
            .filter(
                ExternalServiceSetting.service_type == ExternalServiceType.media_server, **filters
            )
            .one_or_none()
        )

    def find_media_provider_by(self, **filters):
        return (
            self.session.query(ExternalServiceSetting)
            .filter(
                or_(
                    ExternalServiceSetting.service_type == ExternalServiceType.movie_provider,
                    ExternalServiceType.service_type == ExternalServiceType.series_provider,
                ),
                **filters
            )
            .one_or_none()
        )


class PlexSettingRepository(BaseRepository[PlexSetting]):
    pass


class RadarrSettingRepository(BaseRepository[RadarrSetting]):
    pass


class SonarrSettingRepository(BaseRepository[SonarrSetting]):
    pass
