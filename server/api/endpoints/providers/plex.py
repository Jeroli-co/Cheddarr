from fastapi import APIRouter, Depends, HTTPException, status
from plexapi.myplex import MyPlexAccount
from plexapi.video import Movie
from sqlalchemy.orm import Session

from server.api import dependencies as deps
from server import models, schemas
from server.helpers.providers import plex

router = APIRouter()


@router.get("/plex/status")
def get_plex_status(
    current_user: models.User = Depends(deps.current_user),
    db: Session = Depends(deps.db),
):
    plex_config = models.PlexConfig.find_by(db, user=current_user)
    return {"status": plex_config is not None and len(plex_config.servers) != 0}


@router.get("/plex/config", response_model=schemas.PlexConfig)
def get_plex_config(
    current_user: models.User = Depends(deps.current_user),
    db: Session = Depends(deps.db),
):
    plex_config = models.PlexConfig.find_by(db, user=current_user)
    if not plex_config:
        return {}
    return plex_config


@router.patch("/plex/config")
def update_plex_config(
    update_data: schemas.PlexConfigUpdate,
    current_user: models.User = Depends(deps.current_user),
    db: Session = Depends(deps.db),
):
    plex_config = models.PlexConfig.find_by(db, user=current_user)
    if not plex_config:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No existing Plex config.")
    plex_config.update(db, update_data)
    return plex_config


@router.delete("/plex/config")
def unlink_plex_account(
    current_user: models.User = Depends(deps.current_user),
    db: Session = Depends(deps.db),
):
    plex_config = models.PlexConfig.find_by(db, user=current_user)
    if not plex_config:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No Plex account linked.")
    plex_config.delete(db)
    return {"message": "Plex account unlinked."}


@router.post(
    "/plex/config/servers",
    response_model=schemas.PlexServer,
    status_code=status.HTTP_201_CREATED,
)
def add_plex_server(
    server_in: schemas.PlexServer,
    current_user: models.User = Depends(deps.current_user),
    db: Session = Depends(deps.db),
):
    plex_config = models.PlexConfig.find_by(db, user=current_user)
    if not plex_config:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No existing Plex config.")
    server = models.PlexServer(**server_in.dict())
    if server in plex_config.servers:
        raise HTTPException(
            status.HTTP_409_CONFLICT, "This server is already in the config."
        )
    plex_config.servers.append(server)
    plex_config.save(db)
    return plex_config


@router.delete("/plex/config/servers/{machine_id}")
def remove_plex_server(
    machine_id: str,
    current_user: models.User = Depends(deps.current_user),
    db: Session = Depends(deps.db),
):
    plex_config = models.PlexConfig.find_by(db, user=current_user)
    if not plex_config:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No existing Plex config.")
    plex_server = models.PlexServer.find_by(db, machine_id=machine_id)
    if not plex_server or plex_server not in plex_config.servers:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND, "No linked server found with this id."
        )
    plex_config.servers.remove(plex_server)
    if not plex_server.configs:
        plex_server.delete(db)
    plex_config.save(db)
    return plex_config


@router.get("/plex/servers")
def get_plex_servers(
    current_user: models.User = Depends(deps.current_user),
    db: Session = Depends(deps.db),
):
    plex_config = models.PlexConfig.find_by(db, user=current_user)
    if not plex_config:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No existing Plex config.")
    api_key = plex_config.api_key
    plex_account = MyPlexAccount(api_key)
    servers = [
        {"name": resource.name, "machine_id": resource.clientIdentifier}
        for resource in plex_account.resources()
        if resource.provides == "server"
    ]
    return servers


@router.get("/plex/movies/recent")
def get_plex_recent_movies(
    current_user: models.User = Depends(deps.current_user),
    db: Session = Depends(deps.db),
):
    plex_server = plex.connect_servers(db, current_user.id)
    movie_sections = plex.library_sections(plex_server, section_type="movies")
    recent_movies = [
        movie
        for section in movie_sections
        for movie in section.recentlyAdded(maxresults=20)
    ]
    return recent_movies


@router.get("/plex/movies/{movie_id}")
def get_plex_movie(
    movie_id: int,
    current_user: models.User = Depends(deps.current_user),
    db: Session = Depends(deps.db),
):
    plex_server = plex.connect_servers(db, current_user.id)
    movie = plex_server.fetchItem(ekey=int(movie_id))
    movie.reload()
    return movie


@router.get("/plex/series/recent")
def get_plex_recent_series(
    current_user: models.User = Depends(deps.current_user),
    db: Session = Depends(deps.db),
):
    plex_server = plex.connect_servers(db, current_user.id)
    series_section = plex.library_sections(plex_server, section_type="series")
    recent_series = [
        series
        for section in series_section
        for series in section.recentlyAdded(maxresults=20)
    ]
    return recent_series


@router.get("/plex/series/{series_id>}")
def get_plex_series(
    series_id: int,
    current_user: models.User = Depends(deps.current_user),
    db: Session = Depends(deps.db),
):
    plex_server = plex.connect_servers(db, current_user.id)
    series = plex_server.fetchItem(ekey=series_id)
    series.reload()
    return series


@router.get("/plex/seasons/{season_id}")
def get_plex_season(
    season_id: int,
    current_user: models.User = Depends(deps.current_user),
    db: Session = Depends(deps.db),
):
    plex_server = plex.connect_servers(db, current_user.id)
    season = plex_server.fetchItem(ekey=season_id)
    season.reload()
    return season


@router.get("/plex/episodes/{episode_id}")
def get_plex_episode(
    episode_id: int,
    current_user: models.User = Depends(deps.current_user),
    db: Session = Depends(deps.db),
):
    plex_server = plex.connect_servers(db, current_user.id)
    episode = plex_server.fetchItem(ekey=episode_id)
    episode.reload()
    return episode


@router.get("/plex/on-deck")
def get_plex_on_deck(
    current_user: models.User = Depends(deps.current_user),
    db: Session = Depends(deps.db),
):
    plex_server = plex.connect_servers(db, current_user.id)
    on_deck = plex_server.library.onDeck()
    on_deck = [
        plex_movie_serializer.dump(media)
        if isinstance(media, Movie)
        else plex_episode_serializer.dump(media)
        for media in on_deck
    ]
    return on_deck
