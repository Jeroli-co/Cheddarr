from http import HTTPStatus

from plexapi.exceptions import PlexApiException
from plexapi.library import MovieSection, ShowSection
from plexapi.myplex import MyPlexAccount

from server.exceptions import HTTPError
from server.providers.models import PlexConfig


def user_server(user):
    plex_config = PlexConfig.find(user)
    api_key = plex_config.provider_api_key
    server_name = plex_config.machine_name
    try:
        return MyPlexAccount(api_key).resource(server_name).connect()
    except PlexApiException:
        raise HTTPError(
            "Error while connecting to Plex server",
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
        )


def library_sections(plex_server, section_id=None, section_type=None):
    if section_id is not None:
        pass
    if section_type is not None:
        if section_type == "movies":
            libtype = MovieSection
        elif section_type == "series":
            libtype = ShowSection
        else:
            raise ValueError("Wrong value: section_type must be 'movies' or 'series'.")
        sections = [
            section
            for section in plex_server.library.sections()
            if isinstance(section, libtype)
        ]
        return sections
    raise ValueError("Missing argument: section_id or section_type are required.")
