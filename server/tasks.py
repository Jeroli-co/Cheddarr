from flask import current_app as app
from sendgrid import Content, From, Mail, To

from server.extensions import celery, mail


@celery.task
def send_email(to_email, subject, html_content):
    from_email = From(*app.config.get("MAIL_DEFAULT_SENDER"))
    message = Mail(
        from_email=from_email,
        to_emails=To(to_email),
        subject=subject,
        html_content=Content("text/html", html_content),
    )
    try:
        mail.send(message)
    except Exception:
        raise Exception
