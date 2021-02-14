from typing import List

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)

from server import models, schemas
from server.api import (
    dependencies as deps,
)
from server.core import config
from server.repositories import UserRepository, NotificationAgentRepository


router = APIRouter()

##########################################
# Notifications                          #
##########################################


@router.get(
    "",
    response_model=List[schemas.Notification],
)
def get_all_notifications(
    current_user: models.User = Depends(deps.get_current_user),
):
    return current_user.notifications


@router.delete("/{id}", tags=["notifications"])
def delete_notification(
    id: int,
    current_user: models.User = Depends(deps.get_current_user),
    user_repo: UserRepository = Depends(deps.get_repository(UserRepository)),
):
    current_user.notifications = [n for n in current_user.notifications if n.id != id]
    user_repo.save(current_user)

    return {"detail": "Notification deleted"}


@router.delete("", tags=["notifications"])
def delete_all_notifications(
    current_user: models.User = Depends(deps.get_current_user),
    user_repo: UserRepository = Depends(deps.get_repository(UserRepository)),
):
    current_user.notifications = []
    user_repo.save(current_user)

    return {"detail": "Notifications deleted"}


##########################################
#  Agents                                #
##########################################


@router.get(
    "/agents/email",
    response_model=schemas.EmailAgent,
    dependencies=[Depends(deps.get_current_user)],
)
def get_email_agent(
    notif_agent_repo: NotificationAgentRepository = Depends(
        deps.get_repository(NotificationAgentRepository)
    ),
):
    agent = notif_agent_repo.find_by(name=models.Agent.email)
    return agent


@router.put(
    "/agents/email",
    response_model=schemas.EmailAgent,
    dependencies=[Depends(deps.get_current_user)],
)
def update_email_agent(
    agent_in: schemas.EmailAgent,
    notif_agent_repo: NotificationAgentRepository = Depends(
        deps.get_repository(NotificationAgentRepository)
    ),
):
    agent = notif_agent_repo.find_by(name=models.Agent.email)
    if agent is None:
        agent = agent_in.to_orm(models.NotificationAgent)
        agent.name = models.Agent.email
    else:
        agent.update(agent_in)
    notif_agent_repo.save(agent)
    if agent.enabled:
        config.set(MAIL_ENABLED=True)
    else:
        config.set(MAIL_ENABLED=False)
    return agent
