import re
from typing import List, Optional, Union

from asgiref.sync import sync_to_async
from plexapi.video import (
    Episode as PlexEpisode,
    Movie as PlexMovie,
    Season as PlexSeason,
    Show as PlexSeries,
    Video as PlexVideo,
)
from sqlalchemy.ext.asyncio import AsyncSession

from server.core import scheduler
from server.database.session import DBSession
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
from server.services import plex, tmdb

TMDB_REGEX = "tmdb|themoviedb"
IMDB_REGEX = "imdb"
TVDB_REGEX = "tvdb|thetvdb"


@scheduler.scheduled_job(
    "interval",
    id="plex-full-sync",
    name="Plex Full Library Sync",
    coalesce=True,
    hours=5,
)
async def sync_plex_servers_libraries(server_id=None):
    async with DBSession.get_session(new_engine=True) as db_session:
        plex_setting_repo = PlexSettingRepository(db_session)

        if server_id is not None:
            plex_settings = await plex_setting_repo.find_all_by(server_id=server_id)
        else:
            plex_settings = await plex_setting_repo.find_all_by()
        for setting in plex_settings:
            server = await plex.get_server(
                base_url=setting.host, port=setting.port, ssl=setting.ssl, api_key=setting.api_key
            )
            for section in setting.libraries:
                library_media = await sync_to_async(server.library.section(section.name).all)()
                await process_plex_media_list(
                    library_media,
                    setting.server_id,
                    section.id,
                    db_session,
                )


@scheduler.scheduled_job(
    "interval",
    id="plex-recently-added-sync",
    name="Plex Recently Added Sync",
    coalesce=True,
    minutes=10,
)
async def sync_plex_servers_recently_added(server_id=None):
    async with DBSession.get_session(new_engine=True) as db_session:
        plex_setting_repo = PlexSettingRepository(db_session)

        if server_id is not None:
            plex_settings = await plex_setting_repo.find_all_by(server_id=server_id)
        else:
            plex_settings = await plex_setting_repo.find_all_by()
        for setting in plex_settings:
            server = await plex.get_server(
                base_url=setting.host, port=setting.port, ssl=setting.ssl, api_key=setting.api_key
            )

            for section in setting.libraries:
                recent_library_media = await sync_to_async(
                    server.library.section(section.name).recentlyAdded
                )()
                await process_plex_media_list(
                    recent_library_media,
                    setting.server_id,
                    section.id,
                    db_session,
                )


async def process_plex_media_list(
    plex_media_list: List[PlexVideo], server_id: str, library_id: int, db_session: AsyncSession
):
    media_repo = MediaRepository(db_session)
    server_media_repo = MediaServerMediaRepository(db_session)
    server_season_repo = MediaServerSeasonRepository(db_session)
    server_episode_repo = MediaServerEpisodeRepository(db_session)
    for plex_media in plex_media_list:
        if isinstance(plex_media, PlexMovie):
            await process_plex_media(
                server_id,
                library_id,
                plex_media,
                media_repo=media_repo,
                server_media_repo=server_media_repo,
            )

        elif isinstance(plex_media, PlexSeries):
            await process_plex_series(
                server_id,
                library_id,
                plex_media,
                media_repo=media_repo,
                server_media_repo=server_media_repo,
                server_season_repo=server_season_repo,
                server_episode_repo=server_episode_repo,
            )

        elif isinstance(plex_media, PlexSeason):
            await process_plex_season_and_episodes(
                server_id,
                library_id,
                plex_media,
                media_repo=media_repo,
                server_media_repo=server_media_repo,
                server_season_repo=server_season_repo,
                server_episode_repo=server_episode_repo,
            )

        elif isinstance(plex_media, PlexEpisode):
            await process_plex_episode(
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


async def process_plex_media(
    server_id: str,
    library_id: int,
    plex_media: Union[PlexMovie, PlexSeries],
    *,
    media_repo: MediaRepository,
    server_media_repo: MediaServerMediaRepository,
) -> Optional[MediaServerMedia]:
    tmdb_id, imdb_id, tvdb_id = await find_guids(plex_media)
    if not any((tmdb_id, imdb_id, tvdb_id)):
        return

    media = await media_repo.find_by_external_id(tmdb_id=tmdb_id, imdb_id=imdb_id, tvdb_id=tvdb_id)
    if media is None:
        media = Media(
            tmdb_id=tmdb_id,
            imdb_id=imdb_id,
            tvdb_id=tvdb_id,
            title=plex_media.title,
            media_type=MediaType.movie if isinstance(plex_media, PlexMovie) else MediaType.series,
        )
    server_media = await server_media_repo.find_by(
        external_id=plex_media.ratingKey, server_id=server_id
    )

    if server_media is None:
        server_media = MediaServerMedia(
            server_id=server_id,
            server_library_id=library_id,
            media=media,
            external_id=plex_media.ratingKey,
            added_at=plex_media.addedAt,
        )
        await server_media_repo.save(server_media)
    return server_media


async def process_plex_series(
    server_id: str,
    library_id: int,
    plex_media: Union[PlexMovie, PlexSeries],
    *,
    media_repo: MediaRepository,
    server_media_repo: MediaServerMediaRepository,
    server_season_repo: MediaServerSeasonRepository,
    server_episode_repo: MediaServerEpisodeRepository,
) -> Optional[MediaServerMedia]:
    server_series = await process_plex_media(
        server_id,
        library_id,
        plex_media,
        media_repo=media_repo,
        server_media_repo=server_media_repo,
    )

    if server_series is None:
        return

    for plex_season in plex_media.seasons():
        await process_plex_season_and_episodes(
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


async def process_plex_season(
    server_id: str,
    library_id: int,
    plex_season: PlexSeason,
    *,
    server_series: MediaServerMedia = None,
    media_repo: MediaRepository,
    server_media_repo: MediaServerMediaRepository,
    server_season_repo: MediaServerSeasonRepository,
) -> Optional[MediaServerSeason]:

    season = await server_season_repo.find_by(
        external_id=plex_season.ratingKey,
        server_id=server_id,
    )
    if season is None:
        season = MediaServerSeason(
            season_number=plex_season.seasonNumber,
            external_id=plex_season.ratingKey,
            added_at=plex_season.addedAt,
        )
        if server_series is not None:
            season.server_media = server_series
        else:
            server_media = await process_plex_media(
                server_id,
                library_id,
                plex_season.show(),
                media_repo=media_repo,
                server_media_repo=server_media_repo,
            )
            if server_media is None:
                return
            season.server_media = server_media
    return season


async def process_plex_season_and_episodes(
    server_id: str,
    library_id: int,
    plex_season: PlexSeason,
    *,
    server_series: MediaServerMedia = None,
    media_repo: MediaRepository,
    server_media_repo: MediaServerMediaRepository,
    server_season_repo: MediaServerSeasonRepository,
    server_episode_repo: MediaServerEpisodeRepository,
) -> Optional[MediaServerSeason]:
    server_season = await process_plex_season(
        server_id,
        library_id,
        plex_season,
        server_series=server_series,
        media_repo=media_repo,
        server_media_repo=server_media_repo,
        server_season_repo=server_season_repo,
    )
    if server_season is None:
        return
    for plex_episode in plex_season.episodes():
        await process_plex_episode(
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
    await server_season_repo.save(server_season)
    return server_season


async def process_plex_episode(
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
) -> Optional[MediaServerEpisode]:

    episode = await server_episode_repo.find_by(
        external_id=plex_episode.ratingKey,
        server_id=server_id,
    )
    if episode is None:
        episode = MediaServerEpisode(
            episode_number=plex_episode.index,
            external_id=plex_episode.ratingKey,
            added_at=plex_episode.addedAt,
            server_id=server_id,
        )
        if server_season is not None:
            episode.season = server_season
        else:
            season = await process_plex_season(
                server_id,
                library_id,
                plex_episode.season(),
                server_series=server_series,
                media_repo=media_repo,
                server_media_repo=server_media_repo,
                server_season_repo=server_season_repo,
            )
            if season is None:
                return
            episode.season = season
        await server_episode_repo.save(episode)
    return episode


async def find_guids(media: Union[PlexMovie, PlexSeries]) -> (int, str, int):
    try:
        guids = [media.guid]
        if hasattr(media, "guids") and media.guids is not None:
            guids.extend(guid.id for guid in media.guids)
    except Exception:
        return None, None, None

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

    try:
        if tmdb_id is None:
            tmdb_id = await tmdb.find_tmdb_id_from_external_id(imdb_id, tvdb_id)
            if tmdb_id is None:
                return None, None, None
        if isinstance(media, PlexSeries) and tvdb_id is None:
            tvdb_id = (await tmdb.find_external_ids_from_tmdb_id(tmdb_id)).get("tvdb_id")
    except Exception:
        return None, None, None

    return tmdb_id, imdb_id, tvdb_id
