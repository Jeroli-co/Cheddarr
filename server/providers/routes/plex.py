from http import HTTPStatus

from flask_login import current_user, login_required
from plexapi.myplex import MyPlexAccount

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


@provider.route("/plex/config/", methods=["PUT"])
@login_required
def update_plex_config():
    config_form = PlexConfigForm()
    if not config_form.validate():
        raise InvalidUsage(
            "Error while updating provider's config",
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
            payload=config_form.errors,
        )
    updated_config = config_form.data
    user_config = PlexConfig.query.filter_by(user_id=current_user.id).one_or_none()
    if not user_config:
        raise InvalidUsage(
            "No config created for this provider", status_code=HTTPStatus.BAD_REQUEST
        )
    for config, value in updated_config.items():
        setattr(user_config, config, value)
    db.session.commit()
    return plex_serializer.dump(user_config)


@provider.route("/plex/servers/", methods=["GET"])
def get_plex_servers():
    api_key = PlexConfig.get_api_key(current_user)
    print(api_key)
    plex_account = MyPlexAccount(api_key)
    return {}
