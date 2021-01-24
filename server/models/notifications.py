from sqlalchemy import Boolean, Column, ForeignKey, Integer, Text
from sqlalchemy.orm import relationship

from server.database import Model, Timestamp


class Notification(Model, Timestamp):
    id = Column(Integer, primary_key=True)
    message = Column(Text, nullable=False)
    read = Column(Boolean, nullable=False, default=False)
    user_id = Column(ForeignKey("user.id"), nullable=False)
    user = relationship("User", back_populates="notifications")
