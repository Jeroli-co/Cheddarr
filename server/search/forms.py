from wtforms import StringField
from wtforms.validators import AnyOf, InputRequired

from server.forms import ModelForm


class SearchForm(ModelForm):
    value = StringField("Value", [InputRequired()])
    type = StringField("Type", [AnyOf(["", "movies", "series", "friends"])])
