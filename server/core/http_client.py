from typing import Any, Mapping, Optional

import httpx
from fastapi import HTTPException
from loguru import logger


class HttpClient:
    http_client: Optional[httpx.AsyncClient] = None

    @classmethod
    def get_http_client(cls) -> httpx.AsyncClient:
        if cls.http_client is None:
            cls.http_client = httpx.AsyncClient(timeout=20)
        return cls.http_client

    @classmethod
    async def close_http_client(cls) -> None:
        if cls.http_client:
            await cls.http_client.aclose()
            cls.http_client = None

    @classmethod
    async def request(
        cls,
        method: str,
        url: str,
        *,
        params: Optional[Mapping[str, Any]] = None,
        headers: Optional[Mapping[str, Any]] = None,
        data: Any = None,
    ) -> Any:
        client = cls.get_http_client()
        try:
            resp = await client.request(method, url, params=params, headers=headers, data=data)
            if 200 < resp.status_code > 300:
                raise HTTPException(resp.status_code, resp.text)
            json_result = resp.json()
        except Exception as e:
            logger.error(f"An error occurred when calling {url}: {str(e)}")
            raise
        return json_result
