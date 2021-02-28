import re
from typing import List, Union

from plexapi.video import (
    Video as PlexVideo,
    Show as PlexSeries,
    Season as PlexSeason,
    Episode as PlexEpisode,
    Movie as PlexMovie,
)
from sqlalchemy.orm import Session

from server.api.dependencies import get_db
from server.core import scheduler
from server.repositories import (
    MediaServerSettingRepository,
    EpisodeRepository,
    MediaRepository,
    SeasonRepisitory,
)
from server.models import (
    Media,
    MediaServerMedia,
    MediaServerSeason,
    MediaServerEpisode,
    MediaType,
    Season,
    Episode,
)
from server.helpers import plex

TMDB_REGEX = "tmdb|themoviedb"
IMDB_REGEX = "imdb"
TVDB_REGEX = "tvdb|thetvdb"


@scheduler.scheduled_job("interval", hours=5)
def sync_plex_servers_library():
    db_session = next(get_db())
    plex_setting_repo = MediaServerSettingRepository(db_session)
    plex_settings = plex_setting_repo.find_all_by()
    for setting in plex_settings:
        server = plex.get_server(
            base_url=setting.host, port=setting.port, ssl=setting.ssl, api_key=setting.api_key
        )
        plex_library = server.library.all()
        process_plex_media_list(plex_library, setting.server_id, db_session)


@scheduler.scheduled_job("interval", minutes=15)
def sync_plex_servers_recently_added():
    db_session = next(get_db())
    plex_setting_repo = MediaServerSettingRepository(db_session)
    plex_settings = plex_setting_repo.find_all_by()
    for setting in plex_settings:
        server = plex.get_server(
            base_url=setting.host, port=setting.port, ssl=setting.ssl, api_key=setting.api_key
        )
        plex_recent = server.library.recentlyAdded()
        process_plex_media_list(plex_recent, setting.server_id, db_session)


def process_plex_media_list(plex_media_list: List[PlexVideo], server_id, db_session: Session):
    media_repo = MediaRepository(db_session)
    season_repo = SeasonRepisitory(db_session)
    episode_repo = EpisodeRepository(db_session)
    for plex_media in plex_media_list:
        if isinstance(plex_media, PlexMovie):
            new_media = process_plex_media(plex_media, server_id, media_repo)
            media_repo.save(new_media)

        elif isinstance(plex_media, PlexSeries):
            new_media = process_plex_media(plex_media, server_id, media_repo)
            media_repo.save(new_media)
            process_plex_media_list(plex_media.seasons(), server_id, db_session)

        elif isinstance(plex_media, PlexSeason):
            new_media = process_plex_season(plex_media, server_id, media_repo, season_repo)
            season_repo.save(new_media)
            process_plex_media_list(plex_media.episodes(), server_id, db_session)

        elif isinstance(plex_media, PlexEpisode):
            new_media = process_plex_episode(
                plex_media, server_id, media_repo, season_repo, episode_repo
            )
            episode_repo.save(new_media)

        else:
            continue


def process_plex_media(
    plex_media: Union[PlexMovie, PlexSeries], server_id: str, media_repo: MediaRepository
) -> Media:
    tmdb_id, imdb_id, tvdb_id = find_guids(plex_media)
    media = media_repo.find_by_any_external_id(external_ids=[tmdb_id, imdb_id, tvdb_id])
    if media is None:
        media = Media(
            tmdb_id=tmdb_id,
            imdb_id=imdb_id,
            tvdb_id=tvdb_id,
            title=plex_media.title,
            media_type=MediaType.movies if isinstance(plex_media, PlexMovie) else MediaType.series,
        )
        media.server_media.append(
            MediaServerMedia(
                server_id=server_id,
                media=media,
                external_media_id=plex_media.ratingKey,
                added_at=plex_media.addedAt,
            )
        )

    return media


def process_plex_season(
    plex_season: PlexSeason,
    server_id: str,
    media_repo: MediaRepository,
    season_repo: SeasonRepisitory,
) -> Season:

    tmdb_id, imdb_id, tvdb_id = find_guids(plex_season.show())

    season = season_repo.find_by_any_external_id_and_season_number(
        season_number=plex_season.index, external_ids=[tmdb_id, imdb_id, tvdb_id]
    )
    if season is None:
        season = Season(
            season_number=plex_season.seasonNumber,
        )
        season.media = process_plex_media(plex_season.show(), server_id, media_repo)
        season.server_season.append(
            MediaServerSeason(
                server_id=server_id,
                season=season,
                external_media_id=plex_season.ratingKey,
                added_at=plex_season.addedAt,
            )
        )

    return season


def process_plex_episode(
    plex_episode: PlexEpisode,
    server_id: str,
    media_repo: MediaRepository,
    season_repo: SeasonRepisitory,
    episode_repo: EpisodeRepository,
) -> Episode:
    tmdb_id, imdb_id, tvdb_id = find_guids(plex_episode.show())

    episode = episode_repo.find_by_any_external_id_and_season_number_and_episode_number(
        episode_number=plex_episode.index,
        season_number=plex_episode.seasonNumber,
        external_ids=[tmdb_id, imdb_id, tvdb_id],
    )

    if episode is None:
        episode = Episode(
            episode_number=plex_episode.index,
        )
        episode.season = process_plex_season(
            plex_episode.season(), server_id, media_repo, season_repo
        )
        episode.server_episode.append(
            MediaServerEpisode(
                server_id=server_id,
                episode=episode,
                external_media_id=plex_episode.ratingKey,
                added_at=plex_episode.addedAt,
            )
        )

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

    return find_guid(TMDB_REGEX), find_guid(IMDB_REGEX), find_guid(TVDB_REGEX)
