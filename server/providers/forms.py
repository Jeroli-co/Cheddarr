from server.forms import ModelForm
from server.providers.models import PlexConfig
from server.providers.models.provider_config import RadarrConfig, SonarrConfig


class PlexConfigForm(ModelForm):
    class Meta:
        model = PlexConfig
        exclude = ["plex_user_id"]


class SonarrConfigForm(ModelForm):
    class Meta:
        model = SonarrConfig


class RadarrConfigForm(ModelForm):
    class Meta:
        model = RadarrConfig
