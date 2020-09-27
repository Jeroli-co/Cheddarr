import functools
import inspect
from typing import Union, Type, Dict

from flask_marshmallow import Marshmallow, Schema
from marshmallow.fields import Field
from webargs.flaskparser import use_args, use_kwargs

ma = Marshmallow()


def webargs(
    schema: Union[Type[Schema], dict],
    only=None,
    exclude=None,
    schema_kwargs=None,
    **kwargs
):
    exclude = exclude or []
    schema_kwargs = schema_kwargs or {}

    def factory(request):
        # Respect partial updates for PATCH requests
        partial = request.method == "PATCH" or only is not None
        return schema(
            only=only,
            exclude=exclude,
            partial=partial,
            context={"request": request},
            **schema_kwargs
        )

    if inspect.isclass(schema):
        return use_args(factory, **kwargs)
    return use_args(schema, **kwargs)


def webkwargs(
    schema: Union[Type[Schema], dict],
    only=None,
    exclude=None,
    schema_kwargs=None,
    **kwargs
):
    exclude = exclude or []
    schema_kwargs = schema_kwargs or {}

    def factory(request):
        # Respect partial updates for PATCH requests
        partial = request.method == "PATCH" or only is not None
        return schema(
            only=only,
            exclude=exclude,
            partial=partial,
            context={"request": request},
            **schema_kwargs
        )

    if inspect.isclass(schema):
        return use_kwargs(factory, **kwargs)
    return use_kwargs(schema, **kwargs)


def jsonify_with(
    schema: Union[Type[Schema], Dict[str, Type[Field]]],
    many: bool = None,
    only=None,
    exclude=None,
    schema_kwargs=None,
):
    exclude = exclude or []
    schema_kwargs = schema_kwargs or {}

    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            result = func(*args, **kwargs)
            if inspect.isclass(schema):
                _schema = schema(only=only, exclude=exclude, **schema_kwargs)
            elif isinstance(schema, Schema):
                _schema = schema
            else:
                _schema = Schema.from_dict(schema)(
                    only=only, exclude=exclude, **schema_kwargs
                )
            return (
                _schema.jsonify(result, many)
                if many is not None
                else _schema.jsonify(result)
            )

        return wrapper

    return decorator


query = functools.partial(webkwargs, location="query")
form = functools.partial(webkwargs, location="form")
files = functools.partial(webkwargs, location="files")
body = functools.partial(webargs, location="json")
