from server.schemas import APIModel, UserPublic


class Notificaiton(APIModel):
    message: str
    read: bool
    user: UserPublic


class NotificationAgent(APIModel):
    name: str
    enabled: bool


class EmailAgent(NotificationAgent):
    smtp_port: int
    smtp_host: str
    smtp_user: str
    smtp_password: str
    sender_address: str
    sender_name: str
    ssl: bool
