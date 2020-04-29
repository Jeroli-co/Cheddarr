from plexapi.exceptions import PlexApiException
from plexapi.library import LibrarySection, MovieSection, ShowSection
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
        # TODO get section by id
        pass
    if section_type == "movie":
        libtype = MovieSection
    elif section_type == "series":
        libtype = ShowSection
    else:
        libtype = LibrarySection
    sections = [
        section
        for section in plex_server.library.sections()
        if isinstance(section, libtype)
    ]
    return sections


def search(plex_server, section_type, filters, max_results=5):
    if section_type == "movie":
        sections = library_sections(plex_server, section_type="movie")
    elif section_type == "series":
        sections = library_sections(plex_server, section_type="series")
    elif section_type == "all":
        sections = library_sections(plex_server)
        print(sections)
    else:
        raise ValueError(
            "Wrong value: section_type must be 'all', 'movie' or 'series'."
        )
    result = [media for section in sections for media in section.search(**filters)]
    return result
