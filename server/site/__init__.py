from flask import Blueprint

from server.config import REACT_STATIC_FOLDER, REACT_TEMPLATE_FOLDER

site = Blueprint(
    "site",
    __name__,
    template_folder=REACT_TEMPLATE_FOLDER,
    static_folder=REACT_STATIC_FOLDER,
)

from . import views  # noqa
