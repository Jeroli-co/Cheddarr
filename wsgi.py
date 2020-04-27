from server.app import create_app

"""Used for celery worker"""
from server.app import celery  # noqa


app = create_app()
app.app_context().push()
