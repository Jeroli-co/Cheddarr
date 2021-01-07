import { MediaTypes } from "../../logged-in-app/enums/MediaTypes";
import { RequestTypes } from "../../logged-in-app/pages/requests/enums/RequestTypes";

export const APIRoutes = {
  // USER
  GET_PUBLIC_USER: (username: string) => "/users/" + username,
  GET_CURRENT_USER: "/user",
  GET_FRIENDS: "/user/friends",
  GET_INCOMING_FRIEND_REQUESTS: "/user/friends/incoming",
  GET_OUTGOING_FRIEND_REQUESTS: "/user/friends/outgoing",
  DELETE_FRIEND: (username: string) => "/user/friends/" + username,
  ACCEPT_FRIEND_REQUEST: (username: string) => "/user/friends/" + username,
  SEND_FRIEND_REQUEST: "/user/friends",
  SEARCH_FRIENDS: (value: string) => "/user/friends/search?value=" + value,
  GET_FRIENDS_MOVIES_PROVIDERS: "/user/friends?providers_type=movies_provider",
  GET_FRIENDS_SERIES_PROVIDERS: "/user/friends?providers_type=series_provider",
  UPDATE_USER: "/user",
  DELETE_ACCOUNT: "/user",
  INIT_RESET_PASSWORD: "/user/password",
  GET_RESET_PASSWORD_TOKEN_VALIDITY: (token: string) =>
    "/user/password" + token,
  RESET_PASSWORD: (token: string) => "/user/password" + token,

  // PLEX
  GET_PLEX_MOVIE: (plexConfigId: string, movieId: number | string) =>
    "/plex/" + plexConfigId + "/movies/" + movieId,
  GET_PLEX_SERIES: (plexConfigId: string, episodeId: number | string) =>
    "/plex/" + plexConfigId + "/series/" + episodeId,
  GET_PLEX_SEASON: (plexConfigId: string, seasonId: number | string) =>
    "/plex/" + plexConfigId + "/seasons/" + seasonId,
  GET_PLEX_EPISODE: (plexConfigId: string, episodeId: number | string) =>
    "/plex/" + plexConfigId + "/episodes/" + episodeId,
  GET_PLEX_CONFIGS: "/configuration/plex",
  CREATE_PLEX_CONFIG: "/configuration/plex",
  UPDATE_PLEX_CONFIG: (plexConfigId: string) =>
    "/configuration/plex/" + plexConfigId,
  DELETE_PLEX_CONFIG: (plexConfigId: string) =>
    "/configuration/plex/" + plexConfigId,
  GET_PLEX_SERVERS: "/plex/servers",
  GET_PLEX_SERVER: (serverName: string) => "/plex/server/" + serverName,
  SEARCH_PLEX_MOVIES: (plexConfigId: string, value: string) =>
    "/plex/" + plexConfigId + "/search?section=movies&value=" + value,
  SEARCH_PLEX_SERIES: (plexConfigId: string, value: string) =>
    "/plex/" + plexConfigId + "/search?section=series&value=" + value,

  //RADARR
  GET_RADARR_CONFIG: "/configuration/radarr",
  GET_RADARR_INSTANCE_INFO: "/configuration/radarr/instance-info",
  CREATE_RADARR_CONFIG: "/configuration/radarr",
  UPDATE_RADARR_CONFIG: (id: string) => "/configuration/radarr/" + id,

  // SONARR
  GET_SONARR_CONFIG: "/configuration/sonarr",
  GET_SONARR_INSTANCE_INFO: "/configuration/sonarr/instance-info",
  CREATE_SONARR_CONFIG: "/configuration/sonarr",
  UPDATE_SONARR_CONFIG: (id: string) => "/configuration/sonarr/" + id,

  // TMDB
  GET_ALL_MEDIA_BY_TITLE: (title: string) => "/search?value=" + title,
  GET_SERIES_BY_ID: (tvdbId: number) => "/search/series/" + tvdbId,
  GET_SEASON_BY_NUMBER: (tvdbId: number, number: number) =>
    "/search/series/" + tvdbId + "/seasons/" + number,

  // REQUESTS
  CREATE_REQUEST_MOVIE: "/requests/movies",
  CREATE_REQUEST_SERIES: "/requests/series",
  UPDATE_REQUEST_MOVIE: (id: number) => "/requests/movies/" + id,
  UPDATE_REQUEST_SERIES: (id: number) => "/requests/series/" + id,
  // TODO REMOVE MediaTypes & RequestTypes DEPENDENCIES
  GET_REQUESTS: (mediaType: MediaTypes, requestType: RequestTypes) =>
    "/requests/" + mediaType + "/" + requestType,
};
