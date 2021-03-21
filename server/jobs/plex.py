import re
from typing import List, Union

from plexapi.video import (
    Episode as PlexEpisode,
    Movie as PlexMovie,
    Season as PlexSeason,
    Show as PlexSeries,
    Video as PlexVideo,
)
from sqlalchemy.orm import Session

from server.api.dependencies import get_db
from server.core import scheduler
from server.models.media import (
    Media,
    MediaServerEpisode,
    MediaServerMedia,
    MediaServerSeason,
    MediaType,
)
from server.repositories.media import (
    MediaRepository,
    MediaServerEpisodeRepository,
    MediaServerMediaRepository,
    MediaServerSeasonRepository,
)
from server.repositories.settings import PlexSettingRepository
from server.services import plex
from server.services.tmdb import find_tmdb_id_from_external_id

TMDB_REGEX = "tmdb|themoviedb"
IMDB_REGEX = "imdb"
TVDB_REGEX = "tvdb|thetvdb"


@scheduler.scheduled_job("interval", id="plex-full-sync", name="Plex Full Library Sync", hours=5)
def sync_plex_servers_library(server_id=None):
    db_session = next(get_db())
    plex_setting_repo = PlexSettingRepository(db_session)

    if server_id is not None:
        plex_settings = plex_setting_repo.find_all_by(server_id=server_id)
    else:
        plex_settings = plex_setting_repo.find_all_by()
    for setting in plex_settings:
        server = plex.get_server(
            base_url=setting.host, port=setting.port, ssl=setting.ssl, api_key=setting.api_key
        )
        for section in setting.libraries:
            process_plex_media_list(
                server.library.section(section.name).all(),
                setting.server_id,
                section.id,
                db_session,
            )


@scheduler.scheduled_job(
    "interval", id="plex-recently-added-sync", name="Plex Recently Added Sync", minutes=10
)
def sync_plex_servers_recently_added(server_id=None):
    db_session = next(get_db())
    plex_setting_repo = PlexSettingRepository(db_session)

    if server_id is not None:
        plex_settings = plex_setting_repo.find_all_by(server_id=server_id)
    else:
        plex_settings = plex_setting_repo.find_all_by()
    for setting in plex_settings:
        server = plex.get_server(
            base_url=setting.host, port=setting.port, ssl=setting.ssl, api_key=setting.api_key
        )

        for section in setting.libraries:
            process_plex_media_list(
                server.library.section(section.name).recentlyAdded(),
                setting.server_id,
                section.id,
                db_session,
            )


def process_plex_media_list(
    plex_media_list: List[PlexVideo], server_id: str, library_id: int, db_session: Session
):
    media_repo = MediaRepository(db_session)
    server_media_repo = MediaServerMediaRepository(db_session)
    server_season_repo = MediaServerSeasonRepository(db_session)
    server_episode_repo = MediaServerEpisodeRepository(db_session)
    for plex_media in plex_media_list:
        if isinstance(plex_media, PlexMovie):
            process_plex_media(
                server_id,
                library_id,
                plex_media,
                media_repo=media_repo,
                server_media_repo=server_media_repo,
            )

        elif isinstance(plex_media, PlexSeries):
            process_plex_series(
                server_id,
                library_id,
                plex_media,
                media_repo=media_repo,
                server_media_repo=server_media_repo,
                server_season_repo=server_season_repo,
                server_episode_repo=server_episode_repo,
            )

        elif isinstance(plex_media, PlexSeason):
            process_plex_season_and_episodes(
                server_id,
                library_id,
                plex_media,
                media_repo=media_repo,
                server_media_repo=server_media_repo,
                server_season_repo=server_season_repo,
                server_episode_repo=server_episode_repo,
            )

        elif isinstance(plex_media, PlexEpisode):
            process_plex_episode(
                server_id,
                library_id,
                plex_media,
                media_repo=media_repo,
                server_media_repo=server_media_repo,
                server_season_repo=server_season_repo,
                server_episode_repo=server_episode_repo,
            )

        else:
            continue


def process_plex_media(
    server_id: str,
    library_id: int,
    plex_media: Union[PlexMovie, PlexSeries],
    *,
    media_repo: MediaRepository,
    server_media_repo: MediaServerMediaRepository,
) -> MediaServerMedia:
    tmdb_id, imdb_id, tvdb_id = find_guids(plex_media)

    media = media_repo.find_by_external_id(tmdb_id=tmdb_id, imdb_id=imdb_id, tvdb_id=tvdb_id)
    if media is None:
        media = Media(
            tmdb_id=tmdb_id,
            imdb_id=imdb_id,
            tvdb_id=tvdb_id,
            title=plex_media.title,
            media_type=MediaType.movies if isinstance(plex_media, PlexMovie) else MediaType.series,
        )

    server_media = server_media_repo.find_by(
        server_media_id=plex_media.ratingKey, server_id=server_id
    )

    if server_media is None:
        server_media = MediaServerMedia(
            server_id=server_id,
            server_library_id=library_id,
            media=media,
            server_media_id=plex_media.ratingKey,
            added_at=plex_media.addedAt,
        )
        server_media_repo.save(server_media)
    return server_media


def process_plex_series(
    server_id: str,
    library_id: int,
    plex_media: Union[PlexMovie, PlexSeries],
    *,
    media_repo: MediaRepository,
    server_media_repo: MediaServerMediaRepository,
    server_season_repo: MediaServerSeasonRepository,
    server_episode_repo: MediaServerEpisodeRepository,
) -> MediaServerMedia:
    server_series = process_plex_media(
        server_id,
        library_id,
        plex_media,
        media_repo=media_repo,
        server_media_repo=server_media_repo,
    )

    for plex_season in plex_media.seasons():
        process_plex_season_and_episodes(
            server_id,
            library_id,
            plex_season,
            server_series=server_series,
            media_repo=media_repo,
            server_media_repo=server_media_repo,
            server_season_repo=server_season_repo,
            server_episode_repo=server_episode_repo,
        )

    return server_series


def process_plex_season(
    server_id: str,
    library_id: int,
    plex_season: PlexSeason,
    *,
    server_series: MediaServerMedia = None,
    media_repo: MediaRepository,
    server_media_repo: MediaServerMediaRepository,
    server_season_repo: MediaServerSeasonRepository,
) -> MediaServerSeason:

    season = server_season_repo.find_by(
        season_number=plex_season.index,
        server_media_id=plex_season.ratingKey,
        server_id=server_id,
    )
    if season is None:
        season = MediaServerSeason(
            season_number=plex_season.seasonNumber,
            server_media_id=plex_season.ratingKey,
            added_at=plex_season.addedAt,
            server_id=server_id,
        )
        if server_series is not None:
            season.media = server_series
        else:
            season.media = process_plex_media(
                server_id,
                library_id,
                plex_season.show(),
                media_repo=media_repo,
                server_media_repo=server_media_repo,
            )
    return season


def process_plex_season_and_episodes(
    server_id: str,
    library_id: int,
    plex_season: PlexSeason,
    *,
    server_series: MediaServerMedia = None,
    media_repo: MediaRepository,
    server_media_repo: MediaServerMediaRepository,
    server_season_repo: MediaServerSeasonRepository,
    server_episode_repo: MediaServerEpisodeRepository,
) -> MediaServerSeason:
    server_season = process_plex_season(
        server_id,
        library_id,
        plex_season,
        server_series=server_series,
        media_repo=media_repo,
        server_media_repo=server_media_repo,
        server_season_repo=server_season_repo,
    )
    for plex_episode in plex_season.episodes():
        process_plex_episode(
            server_id,
            library_id,
            plex_episode,
            server_series=server_series,
            server_season=server_season,
            media_repo=media_repo,
            server_media_repo=server_media_repo,
            server_season_repo=server_season_repo,
            server_episode_repo=server_episode_repo,
        )
    server_season_repo.save(server_season)
    return server_season


def process_plex_episode(
    server_id: str,
    library_id: int,
    plex_episode: PlexEpisode,
    *,
    server_series: MediaServerMedia = None,
    server_season: MediaServerSeason = None,
    media_repo: MediaRepository,
    server_media_repo: MediaServerMediaRepository,
    server_season_repo: MediaServerSeasonRepository,
    server_episode_repo: MediaServerEpisodeRepository,
) -> MediaServerEpisode:

    episode = server_episode_repo.find_by(
        episode_number=plex_episode.index,
        server_media_id=plex_episode.ratingKey,
        server_id=server_id,
    )
    if episode is None:
        episode = MediaServerEpisode(
            episode_number=plex_episode.index,
            server_media_id=plex_episode.ratingKey,
            added_at=plex_episode.addedAt,
            server_id=server_id,
        )
        if server_season is not None:
            episode.season = server_season
        else:
            episode.season = process_plex_season(
                server_id,
                library_id,
                plex_episode.season(),
                server_series=server_series,
                media_repo=media_repo,
                server_media_repo=server_media_repo,
                server_season_repo=server_season_repo,
            )
        server_episode_repo.save(episode)
    return episode


def find_guids(media: Union[PlexMovie, PlexSeries, PlexSeason, PlexEpisode]):
    guids = [media.guid]
    if hasattr(media, "guids") and media.guids is not None:
        guids.extend(guid.id for guid in media.guids)

    def find_guid(regex):
        return next(
            iter(
                re.findall(
                    r"\w+",
                    next((guid for guid in guids if re.search(regex, guid)), "").partition("://")[
                        -1
                    ],
                )
            ),
            None,
        )

    tmdb_id, imdb_id, tvdb_id = find_guid(TMDB_REGEX), find_guid(IMDB_REGEX), find_guid(TVDB_REGEX)

    if tmdb_id is None:
        tmdb_id = find_tmdb_id_from_external_id(imdb_id, tvdb_id)

    return tmdb_id, imdb_id, tvdb_id
