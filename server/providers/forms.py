from server.forms import ModelForm
from server.providers.models import PlexConfig, SonarrConfig, RadarrConfig


class PlexConfigForm(ModelForm):
    class Meta:
        model = PlexConfig
        exclude = ["plex_user_id"]


class SonarrConfigForm(ModelForm):
    class Meta:
        model = SonarrConfig
        strip_string_fields = True


class RadarrConfigForm(ModelForm):
    class Meta:
        model = RadarrConfig
        strip_string_fields = True
