import math
from typing import Dict, List, Literal, Optional

from fastapi import APIRouter, Body, Depends, HTTPException, status

from server.api import dependencies as deps
from server.core import config, scheduler
from server.core.config import PublicConfig
from server.models.users import UserRole
from server.schemas.core import Job, Log, LogResult

router = APIRouter()


@router.get(
    "/logs",
    response_model=LogResult,
    dependencies=[
        Depends(deps.get_current_user),
        Depends(deps.has_user_permissions([UserRole.manage_settings])),
    ],
)
def get_logs(page: int = 1, per_page: int = 50):
    logs = []
    with open(config.LOGS_FOLDER / config.LOGS_FILENAME) as logfile:
        start = (page - 1) * per_page
        end = page * per_page
        lines = logfile.readlines()
        for line in lines[start:end]:
            time, level, message = line.strip().split(" | ")
            logs.append(Log(time=time, level=level, message=message))
    return LogResult(
        page=page,
        total_results=len(lines),
        total_pages=math.ceil(len(lines) / per_page),
        results=logs,
    )


@router.get(
    "/jobs",
    response_model=List[Job],
    dependencies=[
        Depends(deps.get_current_user),
        Depends(deps.has_user_permissions([UserRole.manage_settings])),
    ],
)
def get_jobs():
    return [
        Job(id=job.id, name=job.name, next_run_time=job.next_run_time)
        for job in scheduler.get_jobs()
    ]


@router.patch(
    "/jobs/{job_id}",
    response_model=Job,
    dependencies=[
        Depends(deps.get_current_user),
        Depends(deps.has_user_permissions([UserRole.manage_settings])),
    ],
)
def modify_job(
    job_id: str,
    action: Literal["run", "pause", "resume"] = Body(...),
    params: Optional[Dict] = Body(None),
):
    job = scheduler.get_job(job_id)
    if job is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "This job does not exist.")
    if action == "run":
        scheduler.add_job(job.func, replace_existing=True, kwargs=params)
    elif action == "pause":
        job.pause()
    elif action == "resume":
        job.resume()
    return Job(id=job.id, name=job.name, next_run_time=job.next_run_time)


@router.get(
    "/config",
    response_model=PublicConfig,
    dependencies=[
        Depends(deps.get_current_user),
        Depends(deps.has_user_permissions([UserRole.admin])),
    ],
)
def get_server_config():
    return PublicConfig(**config.dict(include=set(PublicConfig.__fields__.keys())))


@router.patch(
    "/config",
    response_model=PublicConfig,
    dependencies=[
        Depends(deps.get_current_user),
        Depends(deps.has_user_permissions([UserRole.admin])),
    ],
)
def update_server_config(config_in: PublicConfig):
    config.set_fields(**config_in.dict())
    return PublicConfig(**config.dict(include=set(PublicConfig.__fields__.keys())))
