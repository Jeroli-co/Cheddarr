from itsdangerous import URLSafeTimedSerializer, URLSafeSerializer
from flask import current_app as app
from sendgrid import Mail, From, To, Content
from server import mail


def send_email(to_email, subject, html_content):
    from_email = From(app.config.get("MAIL_DEFAULT_SENDER"))
    message = Mail(
        from_email=from_email,
        to_emails=To(to_email),
        subject=subject,
        html_content=Content("text/html", html_content),
    )
    try:
        mail.send(message)
    except:
        raise Exception


def generate_token(data):
    serializer = URLSafeSerializer(app.secret_key)
    return serializer.dumps(data, salt=app.config.get("SECURITY_PASSWORD_SALT"))


def generate_timed_token(data):
    serializer = URLSafeTimedSerializer(app.secret_key)
    return serializer.dumps(data, salt=app.config.get("SECURITY_PASSWORD_SALT"))


def confirm_token(token, expiration=600):
    serializer = URLSafeTimedSerializer(app.config["SECRET_KEY"])
    try:
        data = serializer.loads(
            token, salt=app.config["SECURITY_PASSWORD_SALT"], max_age=expiration
        )
    except:
        raise Exception
    return data
