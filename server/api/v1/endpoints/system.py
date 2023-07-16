import json
import math
from pathlib import Path
from typing import Literal

from fastapi import APIRouter, Body, Depends, HTTPException, status

from server.api import dependencies as deps
from server.api.dependencies import AppConfig
from server.core.scheduler import scheduler
from server.models.users import UserRole
from server.schemas.base import PaginatedResponse
from server.schemas.system import Job, Log, PublicConfig

router = APIRouter()


@router.get(
    "/logs",
    response_model=PaginatedResponse[Log],
    dependencies=[
        Depends(deps.get_current_user),
        Depends(deps.has_user_permissions([UserRole.manage_settings])),
    ],
)
def get_logs(page: int = 1, per_page: int = 50, *, config: AppConfig) -> PaginatedResponse[Log]:
    logs = []
    with Path(config.logs_folder / config.logs_filename).open() as logfile:
        lines = json.loads("[" + logfile.read().replace("\n", ",").rstrip(",") + "]")
        start = (page - 1) * per_page
        end = page * per_page
        total_results = math.ceil(len(lines))
        total_pages = math.ceil(total_results / per_page)
        logs = [
            Log(
                time=line["record"]["time"]["repr"],
                level=line["record"]["level"]["name"],
                process=line["record"]["name"],
                message=line["text"],
            )
            for line in lines[start:end]
        ]

    return PaginatedResponse[Log](
        page=page,
        total=total_results,
        pages=total_pages,
        results=logs,
    )


@router.get(
    "/jobs",
    response_model=list[Job],
    dependencies=[
        Depends(deps.get_current_user),
        Depends(deps.has_user_permissions([UserRole.manage_settings])),
    ],
)
def get_jobs() -> list[Job]:
    return [Job(id=job.id, name=job.name, next_run_time=job.next_run_time) for job in scheduler.get_jobs()]


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
    action: Literal["run", "pause", "resume"] = Body(..., embed=True),
) -> Job:
    job = scheduler.get_job(job_id)
    if job is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "This job does not exist.")
    if action == "run":
        scheduler.add_job(job.func, replace_existing=True)
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
def get_server_config(config: AppConfig) -> PublicConfig:
    return PublicConfig(**config.model_dump(include=set(PublicConfig.model_fields.keys())))


@router.patch(
    "/config",
    response_model=PublicConfig,
    dependencies=[
        Depends(deps.get_current_user),
        Depends(deps.has_user_permissions([UserRole.admin])),
    ],
)
def update_server_config(config_in: PublicConfig, config: AppConfig) -> PublicConfig:
    config.update(**config_in.model_dump())
    return PublicConfig(**config.model_dump(include=set(PublicConfig.model_fields.keys())))
