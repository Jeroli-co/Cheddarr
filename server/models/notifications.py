from enum import Enum

from sqlalchemy import Boolean, Column, Enum as DBEnum, ForeignKey, Integer, JSON, Text

from server.database import Model, Timestamp


class Agent(str, Enum):
    email = "email"


class NotificationAgent(Model):
    name = Column(DBEnum(Agent), primary_key=True)
    enabled = Column(Boolean, default=True)
    settings = Column(JSON)


class Notification(Model, Timestamp):
    id = Column(Integer, primary_key=True)
    message = Column(Text, nullable=False)
    read = Column(Boolean, nullable=False, default=False)
    user_id = Column(ForeignKey("user.id"), nullable=False)
