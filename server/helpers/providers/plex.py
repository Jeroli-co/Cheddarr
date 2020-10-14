from typing import List, Optional, Type

from plexapi.exceptions import PlexApiException
from plexapi.library import LibrarySection, MovieSection, ShowSection
from plexapi.myplex import MyPlexAccount
from plexapi.server import PlexServer
from sqlalchemy.orm import Session

from server.models import PlexConfig


def connect_servers(db: Session, user_id: int) -> Optional[PlexServer]:
    plex_config = PlexConfig.find_by(db, user_id=user_id)
    assert plex_config
    plex_servers = plex_config.servers
    assert plex_servers
    api_key = plex_config.api_key
    server_name = plex_servers[0].name  # only one server for the moment
    try:
        return MyPlexAccount(api_key).resource(server_name).connect()
    except PlexApiException:
        return None


def library_sections(
    plex_server: PlexServer, section_id=None, section_type=None
) -> List[Type[LibrarySection]]:
    if section_id is not None:
        # TODO get section by id
        pass
    if section_type == "movies":
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


def search(
    plex_server: PlexServer, section_type: str, title: str, filters: dict, max_results=3
):
    if section_type == "movies":
        sections = library_sections(plex_server, section_type="movies")
    elif section_type == "series":
        sections = library_sections(plex_server, section_type="series")
    else:
        sections = library_sections(plex_server)
    result = [
        media
        for section in sections
        for media in section.search(maxresults=max_results, title=title, **filters)
    ]
    return result
