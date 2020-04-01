from wtforms.ext import sqlalchemy

from server.forms import ModelForm
from server.providers.models import PlexConfig


class PlexConfigForm(ModelForm):
    class Meta:
        model = PlexConfig
