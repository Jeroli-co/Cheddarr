from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status

from server.api import (
    dependencies as deps,
)
from server.models.notifications import Agent, NotificationAgent
from server.models.users import User
from server.repositories.notifications import NotificationAgentRepository, NotificationRepository
from server.schemas.notifications import EmailAgentSchema, NotificationsResponse

router = APIRouter()

##########################################
# Notifications                          #
##########################################


@router.get(
    "",
    response_model=NotificationsResponse,
)
async def get_all_notifications(
    current_user: User = Depends(deps.get_current_user),
    notification_repository: NotificationRepository = Depends(deps.get_repository(NotificationRepository)),
) -> Any:
    return await notification_repository.find_by(user_id=current_user.id).paginate()


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_notification(
    id: int,
    current_user: User = Depends(deps.get_current_user),
    notification_repository: NotificationRepository = Depends(deps.get_repository(NotificationRepository)),
) -> None:
    notification = await notification_repository.find_by(id=id).one()
    if notification is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Notification not found")

    if notification.user_id != current_user.id:
        raise HTTPException(status.HTTP_403_FORBIDDEN)

    await notification_repository.remove(notification)


@router.delete("", status_code=status.HTTP_204_NO_CONTENT)
async def delete_all_notifications(
    current_user: User = Depends(deps.get_current_user),
    notification_repository: NotificationRepository = Depends(deps.get_repository(NotificationRepository)),
) -> None:
    await notification_repository.remove_all_by_user_id(current_user.id)


##########################################
#  Agents                                #
##########################################


@router.get(
    "/agents/email",
    response_model=EmailAgentSchema,
    dependencies=[Depends(deps.get_current_user)],
)
async def get_email_agent(
    notif_agent_repo: NotificationAgentRepository = Depends(deps.get_repository(NotificationAgentRepository)),
) -> Any:
    return await notif_agent_repo.find_by(name=Agent.email).one()


@router.put(
    "/agents/email",
    response_model=EmailAgentSchema,
    dependencies=[Depends(deps.get_current_user)],
)
async def upsert_email_agent(
    agent_in: EmailAgentSchema,
    notif_agent_repo: NotificationAgentRepository = Depends(deps.get_repository(NotificationAgentRepository)),
) -> Any:
    agent = await notif_agent_repo.find_by(name=Agent.email).one()
    if agent is None:
        agent = agent_in.to_orm(NotificationAgent)
        agent.name = Agent.email
        await notif_agent_repo.save(agent)
    else:
        await notif_agent_repo.update(agent, agent_in)

    return agent


@router.delete(
    "/agents/email",
    dependencies=[Depends(deps.get_current_user)],
    status_code=status.HTTP_204_NO_CONTENT,
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "No email agent"},
    },
)
async def delete_email_agent(
    notif_agent_repo: NotificationAgentRepository = Depends(deps.get_repository(NotificationAgentRepository)),
) -> None:
    agent = await notif_agent_repo.find_by(name=Agent.email).one()
    if agent is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No email agent is configured.")

    await notif_agent_repo.remove(agent)
