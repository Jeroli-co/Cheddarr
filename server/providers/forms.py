from server.forms import ModelForm
from server.providers.models import PlexConfig, SonarrConfig, RadarrConfig


class PlexConfigForm(ModelForm):
    class Meta:
        model = PlexConfig
        only = ["machine_name", "machine_id"]


class SonarrConfigForm(ModelForm):
    class Meta:
        model = SonarrConfig
        exclude = ["type"]
        strip_string_fields = True


class RadarrConfigForm(ModelForm):
    class Meta:
        model = RadarrConfig
        exclude = ["type"]
        strip_string_fields = True
