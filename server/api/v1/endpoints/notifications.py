from typing import List

from fastapi import APIRouter, Depends, HTTPException, status

from server import models, schemas
from server.api import dependencies as deps
from server.core import config
from server.repositories import UserRepository
from server.repositories.notifications import NotificationAgentRepository

router = APIRouter()

##########################################
# Notifications                          #
##########################################


@router.get("", response_model=List[schemas.Notification])
def get_all_notifications(current_user: models.User = Depends(deps.get_current_user)):
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
# Email agent                            #
##########################################


@router.get(
    "/email",
    response_model=List[schemas.EmailAgent],
    dependencies=[Depends(deps.get_current_user)],
)
def get_email_agents(
    notif_agent_repo: NotificationAgentRepository = Depends(
        deps.get_repository(NotificationAgentRepository)
    ),
):
    agents = notif_agent_repo.find_all_by(name="email")
    return agents


@router.post(
    "/email",
    response_model=schemas.EmailAgent,
    dependencies=[Depends(deps.get_current_user)],
)
def add_email_agent(
    agent_in: schemas.EmailAgentCreateUpdate,
    notif_agent_repo: NotificationAgentRepository = Depends(
        deps.get_repository(NotificationAgentRepository)
    ),
):
    agent = agent_in.to_orm(models.NotificationAgent)
    agent.name = "email"
    notif_agent_repo.save(agent)
    config.set_config(MAIL_ENABLED=True)
    return agent


@router.put(
    "/email/{id}",
    response_model=schemas.EmailAgent,
    dependencies=[Depends(deps.get_current_user)],
)
def update_email_agent(
    agent_id: int,
    agent_in: schemas.EmailAgentCreateUpdate,
    notif_agent_repo: NotificationAgentRepository = Depends(
        deps.get_repository(NotificationAgentRepository)
    ),
):
    agent = notif_agent_repo.find_by(id=agent_id)
    if agent is None:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND, "No email agent settings found with this id."
        )
    agent.update(agent_in)
    notif_agent_repo.save(agent)
    return agent
