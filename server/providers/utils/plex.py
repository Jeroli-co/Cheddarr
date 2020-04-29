from plexapi.exceptions import PlexApiException
from plexapi.library import MovieSection, ShowSection
from plexapi.myplex import MyPlexAccount

from server.exceptions import InternalServerError, BadRequest
from server.providers.models import PlexConfig


def user_server(user):
    plex_config = PlexConfig.find(user)
    api_key = plex_config.provider_api_key
    server_name = plex_config.machine_name
    if server_name is None:
        raise BadRequest("No Plex server linked.")
    try:
        return MyPlexAccount(api_key).resource(server_name).connect()
    except PlexApiException:
        raise InternalServerError("Error while connecting to Plex server.")


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


def search(plex_server, section_type, media_search, max_results=5):
    if section_type == "movies":
        sections = library_sections(plex_server, section_type="movies")
    elif section_type == "series":
        sections = library_sections(plex_server, section_type="series")
    else:
        raise ValueError("Wrong value: section_type must be 'movies' or 'series'.")
    result = [
        media
        for section in sections
        for media in section.search(
            title=media_search.title.data, maxresults=max_results
        )
    ]
    return result
