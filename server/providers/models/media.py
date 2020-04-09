class Video:
    """ Base class for all video objects.

    Attributes:
        poster (str): URL to the poster image.
        title (str): Main title of the media.
    """

    def __init__(self, **kwargs):
        for key, value in kwargs.items():
            setattr(self, key, value)

    def __repr__(self):
        return str(self.__dict__)


class Movie(Video):
    """
    Represents a single Movie.
    """

    def __init__(self, *args, **kwargs):
        super(Movie, self).__init__(*args, **kwargs)
