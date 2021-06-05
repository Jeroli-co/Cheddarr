import { MediaTypes } from "./MediaTypes";
import { RequestTypes } from "./RequestTypes";
import { SearchFilters } from "./SearchFilters";
import { MediaServerTypes } from "./MediaServersTypes";

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
  UPDATE_USER: "/user",
  DELETE_ACCOUNT: "/user",
  INIT_RESET_PASSWORD: "/user/password",
  GET_RESET_PASSWORD_TOKEN_VALIDITY: (token: string) =>
    "/user/password" + token,
  RESET_PASSWORD: (token: string) => "/user/password" + token,
  GET_USERS: (confirmed: boolean) => "/users?confirmed=" + confirmed,
  USER_BY_ID: (id: number | string) => "/users/" + id,

  // MEDIA SERVERS
  GET_MEDIA_SERVERS_LIBRARIES: (
    mediaServerType: MediaServerTypes,
    serverId: string
  ) => "/settings/" + mediaServerType + "/" + serverId + "/libraries",

  // PLEX
  GET_PLEX_CONFIGS: "/settings/plex",
  CREATE_PLEX_CONFIG: "/settings/plex",
  UPDATE_PLEX_CONFIG: (plexConfigId: string) =>
    "/settings/plex/" + plexConfigId,
  DELETE_PLEX_CONFIG: (plexConfigId: string) =>
    "/settings/plex/" + plexConfigId,
  GET_PLEX_SERVERS: "/settings/plex/servers",

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

  // MEDIA
  GET_MEDIA: (title: string, page: number, type: SearchFilters | null) =>
    "/search?value=" +
    title +
    "&page=" +
    page +
    (type ? "&media_type=" + type : ""),
  GET_MOVIE: (id: string) => "/movies/" + id,
  GET_SERIES: (id: string) => "/series/" + id,
  GET_SEASON: (id: string, seasonNumber: number) =>
    "/series/" + id + "/seasons/" + seasonNumber,
  GET_EPISODE: (id: string, seasonNumber: number, episodeNumber: number) =>
    "/series/" + id + "/seasons/" + seasonNumber + "/episodes/" + episodeNumber,
  GET_RECOMMENDED_MOVIES: (id: string) => "/movies/" + id + "/recommended",
  GET_RECOMMENDED_SERIES: (id: string) => "/series/" + id + "/recommended",
  GET_SIMILAR_MOVIES: (id: string) => "/movies/" + id + "/similar",
  GET_SIMILAR_SERIES: (id: string) => "/series/" + id + "/similar",
  GET_MEDIA_RECENTLY_ADDED: (type: MediaTypes) => "/" + type + "/recent",
  GET_MEDIA_POPULAR: (type: MediaTypes) => "/" + type + "/popular",
  GET_MEDIA_UPCOMING: (type: MediaTypes) => "/" + type + "/upcoming",

  // REQUESTS
  CREATE_REQUEST_MOVIE: "/requests/movies",
  CREATE_REQUEST_SERIES: "/requests/series",
  UPDATE_REQUEST_MOVIE: (id: number) => "/requests/movies/" + id,
  UPDATE_REQUEST_SERIES: (id: number) => "/requests/series/" + id,
  // TODO REMOVE MediaTypes & RequestTypes DEPENDENCIES
  GET_REQUESTS: (requestType: RequestTypes) => "/requests/" + requestType,

  // NOTIFICATIONS
  GET_EMAIL_SETTINGS: "/notifications/agents/email",
  PUT_EMAIL_SETTINGS: "/notifications/agents/email",
  DELETE_EMAIL_SETTINGS: "/notifications/agents/email",

  // SYSTEM
  LOGS: "/system/logs",
  JOBS: (id?: string) => `/system/jobs${id ? `/${id}` : ""}`,
  CONFIG: "/system/config",
};
