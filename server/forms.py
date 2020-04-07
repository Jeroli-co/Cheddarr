from flask_wtf import FlaskForm
from wtforms_alchemy import model_form_factory

from server.extensions import db

Form = model_form_factory(FlaskForm)


# Base Form model for Flask-WTF and WTForms-Alchemy compatibility
class ModelForm(Form):
    class Meta:
        unique_validator = None

    @classmethod
    def get_session(self):
        return db.session
