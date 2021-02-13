from dataclasses import dataclass

from sqlalchemy import Boolean, Column, ForeignKey, Integer, JSON, String, Text
from sqlalchemy.orm import relationship

from server.database import Model, Timestamp


class NotificationAgent(Model):
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    enabled = Column(Boolean, default=True)
    settings = Column(JSON)


class Notification(Model, Timestamp):
    id = Column(Integer, primary_key=True)
    message = Column(Text, nullable=False)
    read = Column(Boolean, nullable=False, default=False)
    user_id = Column(ForeignKey("user.id"), nullable=False)
    user = relationship("User", back_populates="notifications")
