from celery import Celery

from server.core import settings

celery_app = Celery(
    "worker", broker=settings.CELERY_BROKER_URL, include=["server.tasks"]
)
