from typing import List

from fastapi import APIRouter, Depends

from server.api import dependencies as deps
from server.core import config
from server.models.users import UserRole
from server.schemas.base import Log

router = APIRouter()


@router.get(
    "/logs",
    response_model=List[Log],
    dependencies=[
        Depends(deps.get_current_user),
        Depends(deps.has_user_permissions([UserRole.manage_settings])),
    ],
)
def get_logs():
    logs = []
    with open(config.LOGS_FOLDER / config.LOGS_FILENAME) as logfile:
        for line in logfile:
            time, level, message = line.strip().split(" - ")
            logs.append({"time": time, "level": level, "message": message})

    return logs
