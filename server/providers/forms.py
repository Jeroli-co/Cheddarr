from server.forms import ModelForm
from server.providers.models import PlexConfig


class PlexConfigForm(ModelForm):
    class Meta:
        model = PlexConfig
        exclude = ["plex_user_id"]
