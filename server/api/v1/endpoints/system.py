import math
from datetime import datetime
from typing import List, Literal

from fastapi import APIRouter, Body, Depends, HTTPException, status

from server.api import dependencies as deps
from server.core import config, scheduler
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
def run_job(job_id: str, action: Literal["run", "pause"] = Body(..., embed=True)):
    job = scheduler.get_job(job_id)
    if job is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "This job does not exist.")
    if action == "run":
        job.modify(next_run_time=datetime.now())
    elif action == "pause":
        job.pause()
    return Job(id=job.id, name=job.name, next_run_time=job.next_run_time)
