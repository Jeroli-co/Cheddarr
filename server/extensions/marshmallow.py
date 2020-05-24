import functools

from flask_marshmallow import Marshmallow
from webargs.flaskparser import use_args as webargs, use_kwargs as webkwargs

ma = Marshmallow()


def use_args(schema_cls, only=None, schema_kwargs=None, **kwargs):
    schema_kwargs = schema_kwargs or {}

    def factory(request):
        # Respect partial updates for PATCH requests
        partial = request.method == "PATCH" or only is not None
        return schema_cls(
            only=only, partial=partial, context={"request": request}, **schema_kwargs
        )

    return webargs(factory, **kwargs)


def use_kwargs(schema_cls, only=None, schema_kwargs=None, **kwargs):
    schema_kwargs = schema_kwargs or {}

    def factory(request):
        # Respect partial updates for PATCH requests
        partial = request.method == "PATCH" or only is not None
        return schema_cls(
            only=only, partial=partial, context={"request": request}, **schema_kwargs
        )

    return webkwargs(factory, **kwargs)


query = functools.partial(use_kwargs, location="query")
form = functools.partial(use_kwargs, location="form")
files = functools.partial(use_kwargs, location="files")
body = functools.partial(use_args, location="json")
