import re
from typing import Any

import plexapi.video as plex_video
from asgiref.sync import sync_to_async
from sqlalchemy.ext.asyncio import AsyncSession

from server.core.scheduler import scheduler
from server.database.session import Session
from server.models.media import (
    Media,
    MediaServerEpisode,
    MediaServerMedia,
    MediaServerSeason,
    MediaType,
)
from server.models.settings import ExternalServiceName
from server.repositories.media import (
    MediaRepository,
    MediaServerEpisodeRepository,
    MediaServerMediaRepository,
    MediaServerSeasonRepository,
)
from server.repositories.settings import MediaServerSettingRepository
from server.services import plex, tmdb


@scheduler.scheduled_job(
    "interval",
    id="plex-full-sync",
    name="Plex Full Library Sync",
    coalesce=True,
    hours=5,
)
async def sync_plex_servers_libraries(server_id: str | None = None) -> None:
    async with Session() as db_session:
        setting_repo = MediaServerSettingRepository(db_session)

        if server_id is not None:
            plex_settings = await setting_repo.find_by(server_id=server_id, service_name=ExternalServiceName.plex).all()
        else:
            plex_settings = await setting_repo.find_by(service_name=ExternalServiceName.plex).all()

        for setting in plex_settings:
            server = await plex.get_server(
                base_url=setting.host,
                port=setting.port,
                ssl=setting.ssl,
                api_key=setting.api_key,
            )

            if server is None:
                continue

            for section in setting.libraries:
                library_media = await sync_to_async(server.library.section(section.name).all)()
                await process_plex_media_list(
                    library_media,
                    setting.server_id,
                    section.library_id,
                    db_session,
                )


@scheduler.scheduled_job(
    "interval",
    id="plex-recently-added-sync",
    name="Plex Recently Added Sync",
    coalesce=True,
    minutes=10,
)
async def sync_plex_servers_recently_added(server_id: str | None = None) -> None:
    async with Session() as db_session:
        setting_repo = MediaServerSettingRepository(db_session)

        if server_id is not None:
            plex_settings = await setting_repo.find_by(server_id=server_id, service_name=ExternalServiceName.plex).all()
        else:
            plex_settings = await setting_repo.find_by(service_name=ExternalServiceName.plex).all()

        for setting in plex_settings:
            server = await plex.get_server(
                base_url=setting.host,
                port=setting.port,
                ssl=setting.ssl,
                api_key=setting.api_key,
            )

            if server is None:
                continue

            for section in setting.libraries:
                recent_library_media = await sync_to_async(server.library.section(section.name).recentlyAdded)()
                await process_plex_media_list(
                    recent_library_media,
                    setting.server_id,
                    section.library_id,
                    db_session,
                )


async def process_plex_media_list(
    plex_media_list: list[plex_video.Video],
    server_id: str,
    library_id: str,
    db_session: AsyncSession,
) -> None:
    media_repo = MediaRepository(db_session)
    server_media_repo = MediaServerMediaRepository(db_session)
    server_season_repo = MediaServerSeasonRepository(db_session)
    server_episode_repo = MediaServerEpisodeRepository(db_session)
    for plex_media in plex_media_list:
        if isinstance(plex_media, plex_video.Movie):
            await process_plex_media(
                server_id,
                library_id,
                plex_media,
                media_repo=media_repo,
                server_media_repo=server_media_repo,
            )

        elif isinstance(plex_media, plex_video.Show):
            await process_plex_series(
                server_id,
                library_id,
                plex_media,
                media_repo=media_repo,
                server_media_repo=server_media_repo,
                server_season_repo=server_season_repo,
                server_episode_repo=server_episode_repo,
            )

        elif isinstance(plex_media, plex_video.Season):
            await process_plex_season_and_episodes(
                server_id,
                library_id,
                plex_media,
                media_repo=media_repo,
                server_media_repo=server_media_repo,
                server_season_repo=server_season_repo,
                server_episode_repo=server_episode_repo,
            )

        elif isinstance(plex_media, plex_video.Episode):
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
    library_id: str,
    plex_media: plex_video.Movie | plex_video.Show,
    *,
    media_repo: MediaRepository,
    server_media_repo: MediaServerMediaRepository,
) -> MediaServerMedia | None:
    tmdb_id, imdb_id, tvdb_id = await find_guids(plex_media)
    if not any((tmdb_id, imdb_id, tvdb_id)):
        return None

    media = await media_repo.find_by_external_id(tmdb_id=tmdb_id, imdb_id=imdb_id, tvdb_id=tvdb_id).one()
    if media is None:
        media = Media(
            tmdb_id=tmdb_id,
            imdb_id=imdb_id,
            tvdb_id=tvdb_id,
            title=plex_media.title,
            media_type=MediaType.movie if isinstance(plex_media, plex_video.Movie) else MediaType.series,
        )

    server_media = await server_media_repo.find_by(external_id=plex_media.ratingKey, server_id=server_id).one()
    if server_media is None:
        server_media = MediaServerMedia(
            server_id=server_id,
            server_library_id=library_id,
            media=media,
            external_id=str(plex_media.ratingKey),
            added_at=plex_media.addedAt,
        )
        await server_media_repo.save(server_media)

    return server_media


async def process_plex_series(
    server_id: str,
    library_id: str,
    plex_media: plex_video.Movie | plex_video.Show,
    *,
    media_repo: MediaRepository,
    server_media_repo: MediaServerMediaRepository,
    server_season_repo: MediaServerSeasonRepository,
    server_episode_repo: MediaServerEpisodeRepository,
) -> MediaServerMedia | None:
    server_series = await process_plex_media(
        server_id,
        library_id,
        plex_media,
        media_repo=media_repo,
        server_media_repo=server_media_repo,
    )

    if server_series is None:
        return None

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
    library_id: str,
    plex_season: plex_video.Season,
    *,
    server_series: MediaServerMedia | None = None,
    media_repo: MediaRepository,
    server_media_repo: MediaServerMediaRepository,
    server_season_repo: MediaServerSeasonRepository,
) -> MediaServerSeason | None:
    season = await server_season_repo.find_by(
        external_id=str(plex_season.ratingKey),
        server_id=server_id,
    ).one()
    if season is None:
        season = MediaServerSeason(
            season_number=plex_season.seasonNumber,
            external_id=str(plex_season.ratingKey),
            added_at=plex_season.addedAt,
            server_id=server_id,
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
                return None
            season.server_media = server_media
    return season


async def process_plex_season_and_episodes(
    server_id: str,
    library_id: str,
    plex_season: plex_video.Season,
    *,
    server_series: MediaServerMedia | None = None,
    media_repo: MediaRepository,
    server_media_repo: MediaServerMediaRepository,
    server_season_repo: MediaServerSeasonRepository,
    server_episode_repo: MediaServerEpisodeRepository,
) -> MediaServerSeason | None:
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
        return None

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
    library_id: str,
    plex_episode: plex_video.Episode,
    *,
    server_series: MediaServerMedia | None = None,
    server_season: MediaServerSeason | None = None,
    media_repo: MediaRepository,
    server_media_repo: MediaServerMediaRepository,
    server_season_repo: MediaServerSeasonRepository,
    server_episode_repo: MediaServerEpisodeRepository,
) -> MediaServerEpisode | None:
    episode = await server_episode_repo.find_by(
        external_id=str(plex_episode.ratingKey),
        server_id=server_id,
    ).one()
    if episode is None:
        episode = MediaServerEpisode(
            episode_number=plex_episode.index,
            external_id=str(plex_episode.ratingKey),
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
                return None
            episode.season = season
        await server_episode_repo.save(episode)
    return episode


async def find_guids(media: plex_video.Movie | plex_video.Show) -> tuple[int | None, str | None, int | None]:
    tmdb_regex = "tmdb|themoviedb"
    imdb_regex = "imdb"
    tvdb_regex = "tvdb|thetvdb"

    try:
        guids = [media.guid]
        if hasattr(media, "guids") and media.guids is not None:
            guids.extend(guid.id for guid in media.guids)
    except Exception:
        return None, None, None

    def find_guid(regex: str) -> Any:
        return next(
            iter(
                re.findall(
                    r"\w+",
                    next((guid for guid in guids if re.search(regex, guid)), "").partition("://")[-1],
                ),
            ),
            None,
        )

    tmdb_id, imdb_id, tvdb_id = find_guid(tmdb_regex), find_guid(imdb_regex), find_guid(tvdb_regex)

    try:
        if tmdb_id is None:
            tmdb_id = await tmdb.find_tmdb_id_from_external_id(
                MediaType.movie if isinstance(media, plex_video.Movie) else MediaType.series,
                imdb_id,
                tvdb_id,
            )
            if tmdb_id is None:
                return None, None, None
        if isinstance(media, plex_video.Show) and tvdb_id is None:
            tvdb_id = (await tmdb.find_external_ids_from_tmdb_id(tmdb_id)).get("tvdb_id")
    except Exception:
        return None, None, None

    return tmdb_id, imdb_id, tvdb_id
