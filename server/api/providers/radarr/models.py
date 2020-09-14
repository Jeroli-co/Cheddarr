from server.database import Boolean, Column, String

from ..models import ProviderConfig, ProviderType


class RadarrConfig(ProviderConfig):

    host = Column(String(128))
    port = Column(String(5), nullable=True)
    ssl = Column(Boolean, default=False)

    def __init__(self, api_key):
        self.api_key = api_key
        self.provider_type = ProviderType.MOVIE_REQUEST
