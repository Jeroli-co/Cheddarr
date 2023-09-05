from collections.abc import Mapping
from json import JSONDecodeError
from typing import Any

import httpx
from fastapi import HTTPException, status
from loguru import logger


class HttpClient:
    http_client: httpx.AsyncClient | None = None

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
        params: Mapping[str, Any] | None = None,
        headers: Mapping[str, Any] | None = None,
        data: Any = None,
    ) -> Any:
        client = cls.get_http_client()

        async def _call() -> Any:
            resp = await client.request(
                method,
                url,
                params=params,
                headers={**(headers or {}), "Content-Type": "application/json"},
                data=data,
            )
            if status.HTTP_200_OK < resp.status_code >= status.HTTP_400_BAD_REQUEST:
                raise HTTPException(resp.status_code, resp.text)
            try:
                return resp.json()
            except JSONDecodeError:
                return None

        try:
            return await _call()
        except Exception:
            logger.exception("An error occurred when calling %s", url)
            raise

    @classmethod
    async def get(cls, url: str, **kwargs: Any) -> Any:
        return await cls.request("GET", url, **kwargs)

    @classmethod
    async def post(cls, url: str, **kwargs: Any) -> Any:
        return await cls.request("POST", url, **kwargs)

    @classmethod
    async def put(cls, url: str, **kwargs: Any) -> Any:
        return await cls.request("PUT", url, **kwargs)

    @classmethod
    async def delete(cls, url: str, **kwargs: Any) -> Any:
        return await cls.request("DELETE", url, **kwargs)
