from http import HTTPStatus

from flask_login import current_user, login_required

from server import db, InvalidUsage
from server.providers.forms import PlexConfigForm
from server.providers.models import PlexConfig
from server.providers.routes import provider
from server.providers.serializers.provider_serializer import plex_serializer


@provider.route("/plex/config/", methods=["GET"])
@login_required
def get_plex_config():
    plex_user_config = PlexConfig.query.filter_by(user_id=current_user.id).one_or_none()
    return plex_serializer.dump(plex_user_config)


# TODO: Fix update in db
@provider.route("/plex/config/", methods=["PUT"])
@login_required
def update_plex_config():
    config_form = PlexConfigForm()
    print(config_form.data)
    if not config_form.validate():
        raise InvalidUsage(
            "Error while updating provider's configs",
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
            payload=config_form.errors,
        )
    updated_config = plex_serializer.load(config_form.data)
    print(updated_config)
    user_config = PlexConfig.query.filter_by(user_id=current_user.id).one_or_none()
    if not user_config:
        raise InvalidUsage(
            "No config created for this provider", status_code=HTTPStatus.BAD_REQUEST
        )
    user_config = updated_config
    print(user_config)
    db.session.commit()
    return plex_serializer.dump(user_config)
