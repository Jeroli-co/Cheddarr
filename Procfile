web: gunicorn wsgi:app
worker: celery worker --app=wsgi:celery
release: python cheddarr.py db upgrade