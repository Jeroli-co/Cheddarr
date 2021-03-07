from typing import List

from fastapi import APIRouter, Depends, HTTPException, status

from server.api import (
    dependencies as deps,
)
from server.core import config
from server.models.notifications import Agent, NotificationAgent
from server.models.users import User
from server.repositories.notifications import NotificationAgentRepository
from server.repositories.users import UserRepository
from server.schemas.core import ResponseMessage
from server.schemas.notifications import EmailAgentSchema, NotificationSchema

router = APIRouter()

##########################################
# Notifications                          #
##########################################


@router.get(
    "",
    response_model=List[NotificationSchema],
)
def get_all_notifications(
    current_user: User = Depends(deps.get_current_user),
):
    return current_user.notifications


@router.delete("/{id}", response_model=ResponseMessage)
def delete_notification(
    id: int,
    current_user: User = Depends(deps.get_current_user),
    user_repo: UserRepository = Depends(deps.get_repository(UserRepository)),
):
    current_user.notifications = [n for n in current_user.notifications if n.id != id]
    user_repo.save(current_user)

    return {"detail": "Notification deleted"}


@router.delete("", response_model=ResponseMessage)
def delete_all_notifications(
    current_user: User = Depends(deps.get_current_user),
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
    response_model=EmailAgentSchema,
    dependencies=[Depends(deps.get_current_user)],
)
def get_email_agent(
    notif_agent_repo: NotificationAgentRepository = Depends(
        deps.get_repository(NotificationAgentRepository)
    ),
):
    agent = notif_agent_repo.find_by(name=Agent.email)
    return agent


@router.put(
    "/agents/email",
    response_model=EmailAgentSchema,
    dependencies=[Depends(deps.get_current_user)],
)
def update_email_agent(
    agent_in: EmailAgentSchema,
    notif_agent_repo: NotificationAgentRepository = Depends(
        deps.get_repository(NotificationAgentRepository)
    ),
):
    agent = notif_agent_repo.find_by(name=Agent.email)
    if agent is None:
        agent = agent_in.to_orm(NotificationAgent)
        agent.name = Agent.email
    else:
        agent.update(agent_in)
    notif_agent_repo.save(agent)
    if agent.enabled:
        config.set(MAIL_ENABLED=True)
    else:
        config.set(MAIL_ENABLED=False)
    return agent


@router.delete(
    "/agents/email",
    dependencies=[Depends(deps.get_current_user)],
    response_model=ResponseMessage,
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "No email agent"},
    },
)
def delete_email_agent(
    notif_agent_repo: NotificationAgentRepository = Depends(
        deps.get_repository(NotificationAgentRepository)
    ),
):
    agent = notif_agent_repo.find_by(name=Agent.email)
    if agent is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No email agent is configured.")
    notif_agent_repo.remove(agent)
    config.set(MAIL_ENABLED=False)
    return {"detail": "Email agent deleted."}
