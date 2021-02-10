from typing import List

from fastapi import APIRouter, Depends

from server import models, schemas
from server.api import dependencies as deps
from server.repositories import UserRepository
from server.repositories.notifications import NotificationAgentRepository

router = APIRouter()

##########################################
# Notifications                          #
##########################################


@router.get("", response_model=List[schemas.Notificaiton])
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


@router.get("/email", response_model=schemas.EmailAgent)
def get_email_agent(
    current_user: models.User = Depends(deps.get_current_user),
    notif_agent_repo: NotificationAgentRepository = Depends(
        deps.get_repository(NotificationAgentRepository)
    ),
):
    pass


@router.put("/email", response_model=schemas.EmailAgent)
def update_email_agent(
    agent_in: schemas.EmailAgent,
    # current_user: models.User = Depends(deps.get_current_user),
    notif_agent_repo: NotificationAgentRepository = Depends(
        deps.get_repository(NotificationAgentRepository)
    ),
):
    agent = models.NotificationAgent(settings=agent_in)
    saved_agent = notif_agent_repo.save(agent)
    return saved_agent
