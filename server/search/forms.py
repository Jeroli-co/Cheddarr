from wtforms import StringField
from wtforms.validators import AnyOf, InputRequired

from server.forms import ModelForm


class MediaSearchForm(ModelForm):
    title = StringField("Name", [InputRequired()])
    type = StringField("Type", [InputRequired(), AnyOf(["all", "movies", "series"])])
