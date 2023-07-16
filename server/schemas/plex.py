from __future__ import annotations

from typing import Self
from urllib.parse import quote

from pydantic import BaseModel, model_validator

from server.schemas.media import MediaServerInfo


class PlexMediaInfo(MediaServerInfo):
    @model_validator(mode="after")
    def get_web_url(self) -> Self:
        media_key = quote(f"/library/metadata/{self.external_id}", safe="")
        self.web_url = f"https://app.plex.tv/desktop#!/server/{self.server_id}/details?key={media_key}"
        return self


class PlexUser(BaseModel):
    id: int
    username: str
    email: str
    thumb: str | None = None
    api_key: str | None = None
