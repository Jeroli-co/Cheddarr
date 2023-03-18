from enum import Enum

from sqlalchemy import JSON, ForeignKey, Text
from sqlalchemy import Enum as DBEnum
from sqlalchemy.orm import Mapped, mapped_column

from server.models.base import Model, Timestamp, intpk


class Agent(str, Enum):
    email = "email"


class NotificationAgent(Model):
    name: Mapped[Agent] = mapped_column(DBEnum(Agent), primary_key=True, repr=True)
    enabled: Mapped[bool] = mapped_column(default=True, repr=True)
    settings = mapped_column(JSON)


class Notification(Model, Timestamp):
    id: Mapped[intpk]
    message: Mapped[str] = mapped_column(Text)
    read: Mapped[bool] = mapped_column(default=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id", ondelete="CASCADE"))
