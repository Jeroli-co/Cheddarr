from __future__ import annotations

from enum import StrEnum

from sqlalchemy import JSON, Enum, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column

from server.models.base import Model, Timestamp


class Agent(StrEnum):
    email = "email"


class NotificationAgent(Model):
    name: Mapped[Agent] = mapped_column(Enum(Agent), primary_key=True, repr=True, init=False)
    settings: Mapped[JSON] = mapped_column(JSON)
    enabled: Mapped[bool] = mapped_column(default=True, repr=True)


class Notification(Model, Timestamp):
    id: Mapped[int] = mapped_column(primary_key=True, init=False, default=None)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id", ondelete="CASCADE"))
    message: Mapped[str] = mapped_column(Text)
    read: Mapped[bool] = mapped_column(default=False)
