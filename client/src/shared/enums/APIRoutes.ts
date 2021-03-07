import { MediaTypes } from "./MediaTypes";
import { RequestTypes } from "./RequestTypes";
import { SearchFilters } from "./SearchFilters";

export const APIRoutes = {
  // AUTH
  CONFIRM_PLEX_SIGN_IN: (query: string) => "/sign-in/plex/confirm" + query,
  SIGN_UP: "/sign-up",
  CONFIRM_EMAIL: (token: string) => "/sign-up/" + token,
  SIGN_IN: "/sign-in",
  INIT_PLEX_SIGN_IN: "/sign-in/plex",
  AUTHORIZE_PLEX_SIGN_IN: "/sign-in/plex/authorize",

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
  GET_FRIENDS_MOVIES_PROVIDERS: "/user/friends?provider_type=movies_provider",
  GET_FRIENDS_SERIES_PROVIDERS: "/user/friends?provider_type=series_provider",
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
  GET_PLEX_LIBRARIES: (serverId: string) =>
    "/settings/plex/" + serverId + "/libraries",
  GET_PLEX_CONFIGS: "/settings/plex",
  CREATE_PLEX_CONFIG: "/settings/plex",
  UPDATE_PLEX_CONFIG: (plexConfigId: string) =>
    "/settings/plex/" + plexConfigId,
  DELETE_PLEX_CONFIG: (plexConfigId: string) =>
    "/settings/plex/" + plexConfigId,
  GET_PLEX_SERVERS: "/settings/plex/servers",
  SEARCH_PLEX_MOVIES: (plexConfigId: string, value: string) =>
    "/plex/" + plexConfigId + "/search?section=movies&value=" + value,
  SEARCH_PLEX_SERIES: (plexConfigId: string, value: string) =>
    "/plex/" + plexConfigId + "/search?section=series&value=" + value,

  //RADARR
  GET_RADARR_CONFIG: "/settings/radarr",
  GET_RADARR_INSTANCE_INFO: "/settings/radarr/instance-info",
  CREATE_RADARR_CONFIG: "/settings/radarr",
  UPDATE_RADARR_CONFIG: (id: string) => "/settings/radarr/" + id,
  DELETE_RADARR_CONFIG: (id: string) => "/settings/radarr/" + id,

  // SONARR
  GET_SONARR_CONFIG: "/settings/sonarr",
  GET_SONARR_INSTANCE_INFO: "/settings/sonarr/instance-info",
  CREATE_SONARR_CONFIG: "/settings/sonarr",
  UPDATE_SONARR_CONFIG: (id: string) => "/settings/sonarr/" + id,
  DELETE_SONARR_CONFIG: (id: string) => "/settings/sonarr/" + id,

  // TMDB
  GET_MEDIA: (title: string, page: number, type: SearchFilters | null) =>
    "/search?value=" +
    title +
    "&page=" +
    page +
    (type ? "&media_type=" + type : ""),
  GET_MOVIE: (id: number | string) => "/movies/" + id,
  GET_SERIES: (id: number | string) => "/series/" + id,
  GET_SEASON: (id: number, seasonNumber: number) =>
    "/series/" + id + "/seasons/" + seasonNumber,
  GET_EPISODE: (id: number, seasonNumber: number, episodeNumber: number) =>
    "/series/" + id + "/seasons/" + seasonNumber + "/episodes/" + episodeNumber,
  GET_RECOMMENDED_MOVIES: (id: number | string) =>
    "/movies/" + id + "/recommended",
  GET_RECOMMENDED_SERIES: (id: number | string) =>
    "/series/" + id + "/recommended",
  GET_SIMILAR_MOVIES: (id: number | string) => "/movies/" + id + "/similar",
  GET_SIMILAR_SERIES: (id: number | string) => "/series/" + id + "/similar",

  // REQUESTS
  CREATE_REQUEST_MOVIE: "/requests/movies",
  CREATE_REQUEST_SERIES: "/requests/series",
  UPDATE_REQUEST_MOVIE: (id: number) => "/requests/movies/" + id,
  UPDATE_REQUEST_SERIES: (id: number) => "/requests/series/" + id,
  // TODO REMOVE MediaTypes & RequestTypes DEPENDENCIES
  GET_REQUESTS: (mediaType: MediaTypes, requestType: RequestTypes) =>
    "/requests/" + mediaType + "/" + requestType,

  // NOTIFICATIONS
  GET_EMAIL_SETTINGS: "/notifications/agents/email",
  PUT_EMAIL_SETTINGS: "/notifications/agents/email",
  DELETE_EMAIL_SETTINGS: "/notifications/agents/email",
};
