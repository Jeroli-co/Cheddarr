import math
from typing import Dict, List, Literal, Optional

from fastapi import APIRouter, Body, Depends, HTTPException, status

from server.api import dependencies as deps
from server.core.config import Config, get_config, PublicConfig
from server.core.scheduler import scheduler
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
def get_logs(page: int = 1, per_page: int = 50, config: Config = Depends(get_config)):
    logs = []
    with open(config.logs_folder / config.logs_filename) as logfile:
        lines = logfile.read().replace("\n", " | ").split(" | ")
        start = (page - 1) * per_page * len(LogResult.__fields__)
        end = page * per_page * len(LogResult.__fields__)
        total_results = math.ceil(len(lines) / len(LogResult.__fields__))
        total_pages = math.ceil(total_results / per_page)

        for time, level, process, message in zip(
            *[iter(lines[start:end])] * len(LogResult.__fields__)
        ):
            logs.append(
                Log(
                    time=time.strip(),
                    level=level.strip(),
                    process=process.strip(),
                    message=message.strip(),
                )
            )

    return LogResult(
        page=page,
        total_results=total_results,
        total_pages=total_pages,
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
def get_server_config(config: Config = Depends(get_config)):
    return PublicConfig(**config.dict(include=set(PublicConfig.__fields__.keys())))


@router.patch(
    "/config",
    response_model=PublicConfig,
    dependencies=[
        Depends(deps.get_current_user),
        Depends(deps.has_user_permissions([UserRole.admin])),
    ],
)
def update_server_config(config_in: PublicConfig, config: Config = Depends(get_config)):
    config.update(**config_in.dict())
    return PublicConfig(**config.dict(include=set(PublicConfig.__fields__.keys())))
