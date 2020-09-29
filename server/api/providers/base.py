from flask import Blueprint
from flask_login import login_required

from server.extensions.login_manager import current_user
from server.extensions.marshmallow import jsonify_with, query
from server.schemas.providers.base import ProviderConfigSchema

providers_bp = Blueprint("providers", __name__)


@providers_bp.route("/")
@login_required
@query(ProviderConfigSchema)
@jsonify_with(ProviderConfigSchema, many=True)
def get_user_providers(**kwargs):
    return current_user.providers.filter_by(**kwargs).all()
