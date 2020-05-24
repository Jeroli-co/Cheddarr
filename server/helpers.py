from typing import List

from flask import Blueprint
from werkzeug.utils import cached_property, import_string


class LazyView(object):
    def __init__(self, import_name):
        self.__module__, self.__name__ = import_name.rsplit(".", 1)
        self.import_name = import_name

    @cached_property
    def view(self):
        return import_string(self.import_name)

    def __call__(self, *args, **kwargs):
        return self.view(*args, **kwargs)


def url(
    blueprint: Blueprint,
    import_name: str,
    url_rules: List[str],
    methods: List[str],
    **options
):
    view = LazyView(blueprint.import_name + ".views." + import_name)
    for url_rule in url_rules:
        blueprint.add_url_rule(url_rule, view_func=view, methods=methods, **options)
