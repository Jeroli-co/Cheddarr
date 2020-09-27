from flask import current_app as app, render_template
from sendgrid import Content, From, Mail, To

from server.api.providers.sonarr.helpers import sonarr_lookup, add_sonarr_series
from server.api.requests.models import SeriesChildRequest
from server.config import API_ROOT
from server.extensions import celery, mail


@celery.task
def send_email(to_email, subject, html_template, html_kwargs=None):
    html_kwargs = html_kwargs or {}
    for k, v in html_kwargs.items():
        html_kwargs[k] = v.replace(API_ROOT, "")
    html_content = render_template(html_template, **html_kwargs)
    from_email = From(*app.config.get("MAIL_DEFAULT_SENDER"))
    message = Mail(
        from_email=from_email,
        to_emails=To(to_email),
        subject=subject,
        html_content=Content("text/html", html_content),
    )
    mail.send(message)


def confirm_sonarr_request(request: SeriesChildRequest):
    provider_config = request.selected_provider
    lookup = sonarr_lookup(request.series.tvdb_id, provider_config)[0]
    if not lookup.get("path"):
        add_sonarr_series(provider_config, lookup)
