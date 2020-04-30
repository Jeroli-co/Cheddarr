from http import HTTPStatus


class HTTPError(Exception):
    def __init__(self, message, status_code=None, payload=None):
        Exception.__init__(self)
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        rv = dict(self.payload or ())
        rv["message"] = self.message
        return rv


class NotFound(HTTPError):
    def __init__(self, message=None, payload=None):
        super().__init__(
            message=message or HTTPStatus.NOT_FOUND.phrase,
            status_code=HTTPStatus.NOT_FOUND,
            payload=payload,
        )


class InternalServerError(HTTPError):
    def __init__(self, message=None, payload=None):
        super().__init__(
            message=message or HTTPStatus.INTERNAL_SERVER_ERROR.phrase,
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
            payload=payload,
        )


class BadRequest(HTTPError):
    def __init__(self, message=None, payload=None):
        super().__init__(
            message=message or HTTPStatus.BAD_REQUEST.phrase,
            status_code=HTTPStatus.BAD_REQUEST,
            payload=payload,
        )


class Gone(HTTPError):
    def __init__(self, message=None, payload=None):
        super().__init__(
            message=message or HTTPStatus.GONE.phrase,
            status_code=HTTPStatus.GONE,
            payload=payload,
        )


class Forbidden(HTTPError):
    def __init__(self, message=None, payload=None):
        super().__init__(
            message=message or HTTPStatus.FORBIDDEN.phrase,
            status_code=HTTPStatus.FORBIDDEN,
            payload=payload,
        )


class Unauthorized(HTTPError):
    def __init__(self, message=None, payload=None):
        super().__init__(
            message=message or HTTPStatus.UNAUTHORIZED.phrase,
            status_code=HTTPStatus.UNAUTHORIZED,
            payload=payload,
        )


class Conflict(HTTPError):
    def __init__(self, message=None, payload=None):
        super().__init__(
            message=message or HTTPStatus.CONFLICT.phrase,
            status_code=HTTPStatus.CONFLICT,
            payload=payload,
        )
