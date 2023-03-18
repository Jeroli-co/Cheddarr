from typing import Any
from urllib.parse import quote

from pydantic import validator

from server.schemas.base import APIModel
from server.schemas.media import MediaServerInfo


class PlexMediaInfo(MediaServerInfo):
    @classmethod
    @validator("web_url", pre=True, always=True)
    def get_web_url(cls, _: str, values: dict[str, Any]) -> str:
        media_key = quote(f"/library/metadata/{values['external_id']}", safe="")
        return f"https://app.plex.tv/desktop#!/server/{values['server_id']}/details?key={media_key}"


class PlexUser(APIModel):
    id: int
    username: str
    email: str
    thumb: str | None
    api_key: str | None
