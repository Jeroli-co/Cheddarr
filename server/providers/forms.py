from server.forms import ModelForm
from server.providers.models import PlexConfig
from server.providers.models.provider_config import RadarrConfig


class PlexConfigForm(ModelForm):
    class Meta:
        model = PlexConfig
        exclude = ["plex_user_id"]


class RadarrConfigForm(ModelForm):
    class Meta:
        model = RadarrConfig
