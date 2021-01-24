from typing import Dict

from fastapi.testclient import TestClient

from server.core.config import settings


def user_authentication_headers(
    *, client: TestClient, email: str, password: str
) -> Dict[str, str]:
    data = {"username": email, "password": password}
    r = client.post(f"{settings.API_PREFIX}/sign-in", data=data)
    response = r.json()
    auth_token = response["access_token"]
    headers = {"Authorization": f"Bearer {auth_token}"}
    return headers
