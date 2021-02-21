import re
from typing import List

from plexapi.video import (
    Video as PlexVideo,
    Show as PlexSeries,
    Season as PlexSeason,
    Episode as PlexEpisode,
    Movie as PlexMovie,
)

from server.api.dependencies import get_db
from server.core import scheduler
from server.repositories import (
    EpisodeRepository,
    PlexSettingRepository,
    MediaRepository,
    SeasonRepisitory,
)
from server.models import Media, MediaType, Season, Episode
from server.helpers import plex

TMDB_REGEX = "tmdb|themoviedb"
IMDB_REGEX = "imdb"
TVDB_REGEX = "tvdb|thetvdb"


@scheduler.scheduled_job("interval", hours=5)
def sync_plex_servers_library():
    plex_setting_repo = PlexSettingRepository(next(get_db()))
    plex_settings = plex_setting_repo.find_all_by()
    for setting in plex_settings:
        server = plex.get_server(
            base_url=setting.host, port=setting.port, ssl=setting.ssl, api_key=setting.api_key
        )
        plex_library = server.library.all()
        process_plex_media(plex_library, setting.id)


@scheduler.scheduled_job("interval", hours=5)
def sync_plex_servers_recently_added():
    plex_setting_repo = PlexSettingRepository(next(get_db()))
    plex_settings = plex_setting_repo.find_all_by()
    for setting in plex_settings:
        server = plex.get_server(
            base_url=setting.host, port=setting.port, ssl=setting.ssl, api_key=setting.api_key
        )
        plex_recent = server.library.recentlyAdded()
        process_plex_media(plex_recent[-1:], setting.id)


def process_plex_media(plex_media_list: List[PlexVideo], setting_id):
    media_repo = MediaRepository(next(get_db()))
    season_repo = SeasonRepisitory(next(get_db()))
    episode_repo = EpisodeRepository(next(get_db()))
    for plex_media in plex_media_list:
        if isinstance(plex_media, PlexMovie):
            exists = media_repo.find_by(provider_media_id=plex_media.ratingKey)
            if exists:
                continue
            new_media = process_plex_movie(plex_media, setting_id)

        elif isinstance(plex_media, PlexSeries):
            exists = media_repo.find_by(provider_media_id=plex_media.ratingKey)
            if exists:
                process_plex_media(plex_media.seasons(), setting_id)
                continue
            new_media = process_plex_series(plex_media, setting_id)
            for season in plex_media.seasons():
                process_plex_season(season, new_media)

        elif isinstance(plex_media, PlexSeason):
            exists = season_repo.find_by(
                provider_media_id=plex_media.ratingKey,
                provider_series_id=plex_media.parentRatingKey,
            )
            if exists:
                process_plex_media(plex_media.episodes(), setting_id)
                continue
            new_media = process_plex_season(plex_media, plex_media.show())
            series = media_repo.find_by(provider_media_id=new_media.provider_series_id)
            if series is None:
                series = process_plex_series(plex_media.show(), setting_id)
            new_media.media = series

        elif isinstance(plex_media, PlexEpisode):
            exists = episode_repo.find_by(
                provider_media_id=plex_media.ratingKey,
                provider_season_id=plex_media.parentRatingKey,
                provider_series_id=plex_media.grandparentRatingKey,
            )
            if exists:
                continue
            new_media = process_plex_episode(plex_media)

        else:
            return

        media_repo.save(new_media)


def process_plex_movie(plex_movie: PlexMovie, setting_id: str) -> Media:
    tmdb_id, imdb_id, tvdb_id = find_guids(plex_movie)

    movie = Media(
        provider_media_id=plex_movie.ratingKey,
        tmdb_id=tmdb_id,
        imdb_id=imdb_id,
        tvdb_id=tvdb_id,
        title=plex_movie.title,
        added_at=plex_movie.addedAt,
        media_type=MediaType.movies,
        provider_setting_id=setting_id,
    )

    return movie


def process_plex_series(plex_series: PlexSeries, setting_id: str) -> Media:
    tmdb_id, imdb_id, tvdb_id = find_guids(plex_series)

    series = Media(
        provider_media_id=plex_series.ratingKey,
        tmdb_id=tmdb_id,
        imdb_id=imdb_id,
        tvdb_id=tvdb_id,
        title=plex_series.title,
        added_at=plex_series.addedAt,
        media_type=MediaType.series,
        provider_setting_id=setting_id,
    )

    return series


def process_plex_season(plex_season: PlexSeason, parent_series: Media) -> Season:
    episodes = []
    for episode in plex_season.episodes():
        episodes.append(process_plex_episode(episode))

    season = Season(
        season_number=plex_season.seasonNumber,
        provider_media_id=plex_season.ratingKey,
        provider_series_id=plex_season.parentRatingKey,
        added_at=plex_season.addedAt,
        episodes=episodes,
        media=parent_series,
    )

    return season


def process_plex_episode(plex_episode: PlexEpisode) -> Episode:
    episode = Episode(
        episode_number=plex_episode.index,
        provider_media_id=plex_episode.ratingKey,
        provider_season_id=plex_episode.parentRatingKey,
        provider_series_id=plex_episode.grandparentRatingKey,
        added_at=plex_episode.addedAt,
    )
    return episode


def find_guids(media: PlexVideo):
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
