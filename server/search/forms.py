from wtforms import StringField
from wtforms.validators import InputRequired

from server.forms import ModelForm


class MediaSearchForm(ModelForm):
    title = StringField("Name", [InputRequired()])
