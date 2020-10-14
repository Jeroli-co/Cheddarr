from uuid import UUID

from server.models import ProviderType
from server.schemas import APIModel


class ProviderConfig(APIModel):

    id: UUID
    api_key: str
    name: str
    enabled: bool
    provider_type: ProviderType
