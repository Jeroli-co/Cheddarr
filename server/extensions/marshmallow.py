import functools

from flask_marshmallow import Marshmallow
from webargs.flaskparser import use_args, use_kwargs

ma = Marshmallow()


def webargs(schema_cls, only=None, schema_kwargs=None, **kwargs):
    schema_kwargs = schema_kwargs or {}

    def factory(request):
        # Respect partial updates for PATCH requests
        partial = request.method == "PATCH" or only is not None
        return schema_cls(
            only=only, partial=partial, context={"request": request}, **schema_kwargs
        )

    return use_args(factory, **kwargs)


def webkwargs(schema_cls, only=None, schema_kwargs=None, **kwargs):
    schema_kwargs = schema_kwargs or {}

    def factory(request):
        # Respect partial updates for PATCH requests
        partial = request.method == "PATCH" or only is not None
        return schema_cls(
            only=only, partial=partial, context={"request": request}, **schema_kwargs
        )

    return use_kwargs(factory, **kwargs)


query = functools.partial(webkwargs, location="query")
form = functools.partial(webkwargs, location="form")
files = functools.partial(webkwargs, location="files")
body = functools.partial(webargs, location="json")
