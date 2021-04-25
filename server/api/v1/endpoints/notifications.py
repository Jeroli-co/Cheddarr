from typing import List

from fastapi import APIRouter, Depends, HTTPException, status

from server.api import (
    dependencies as deps,
)
from server.core import config
from server.models.notifications import Agent, NotificationAgent
from server.models.users import User
from server.repositories.notifications import NotificationAgentRepository, NotificationRepository
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
async def get_all_notifications(
    current_user: User = Depends(deps.get_current_user),
    notification_repository: NotificationRepository = Depends(
        deps.get_repository(NotificationRepository)
    ),
):
    user_notifications = await notification_repository.find_all_by(user_id=current_user.id)
    return user_notifications


@router.delete("/{id}", response_model=ResponseMessage)
async def delete_notification(
    id: int,
    current_user: User = Depends(deps.get_current_user),
    notification_repository: NotificationRepository = Depends(
        deps.get_repository(NotificationRepository)
    ),
):
    notification = await notification_repository.find_by(id=id)
    if notification.user_id != current_user.id:
        raise HTTPException(status.HTTP_403_FORBIDDEN)
    await notification_repository.remove(notification)
    return {"detail": "Notification deleted"}


@router.delete("", response_model=ResponseMessage)
async def delete_all_notifications(
    current_user: User = Depends(deps.get_current_user),
    notification_repository: NotificationRepository = Depends(
        deps.get_repository(NotificationRepository)
    ),
):
    notifications = await notification_repository.find_all_by(user_id=current_user.id)
    await notification_repository.remove(notifications)
    return {"detail": "Notifications deleted"}


##########################################
#  Agents                                #
##########################################


@router.get(
    "/agents/email",
    response_model=EmailAgentSchema,
    dependencies=[Depends(deps.get_current_user)],
)
async def get_email_agent(
    notif_agent_repo: NotificationAgentRepository = Depends(
        deps.get_repository(NotificationAgentRepository)
    ),
):
    agent = await notif_agent_repo.find_by(name=Agent.email)
    return agent


@router.put(
    "/agents/email",
    response_model=EmailAgentSchema,
    dependencies=[Depends(deps.get_current_user)],
)
async def update_email_agent(
    agent_in: EmailAgentSchema,
    notif_agent_repo: NotificationAgentRepository = Depends(
        deps.get_repository(NotificationAgentRepository)
    ),
):
    agent = await notif_agent_repo.find_by(name=Agent.email)
    if agent is None:
        agent = agent_in.to_orm(NotificationAgent)
        agent.name = Agent.email
        await notif_agent_repo.save(agent)
    else:
        await notif_agent_repo.update(agent, agent_in)

    if agent.enabled:
        config.set_fields(MAIL_ENABLED=True)
    else:
        config.set_fields(MAIL_ENABLED=False)
    return agent


@router.delete(
    "/agents/email",
    dependencies=[Depends(deps.get_current_user)],
    response_model=ResponseMessage,
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "No email agent"},
    },
)
async def delete_email_agent(
    notif_agent_repo: NotificationAgentRepository = Depends(
        deps.get_repository(NotificationAgentRepository)
    ),
):
    agent = await notif_agent_repo.find_by(name=Agent.email)
    if agent is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No email agent is configured.")
    await notif_agent_repo.remove(agent)
    config.set_fields(MAIL_ENABLED=False)
    return {"detail": "Email agent deleted."}
