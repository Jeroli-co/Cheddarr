export const routes = {
  HOME: {
    url: "/",
  },

  /** AUTH **/
  SIGN_IN: {
    url: (redirectURI?: string) =>
      redirectURI
        ? "/auth/sign-in?redirectURI=" + redirectURI
        : "/auth/sign-in",
  },
  CONFIRM_PLEX_SIGNIN: { url: "/auth/sign-in/plex/confirm" },
  SIGN_UP: { url: "/auth/sign-up" },
  RESET_PASSWORD: {
    url: (token: string) => "/auth/password/" + token,
  },

  /** USERS **/
  USERS: { url: "/users" },
  PROFILE: {
    url: (id?: number | string) => `/profile${id ? `/${id}` : ""}`,
  },

  /** SETTINGS **/
  SETTINGS: { url: "/settings" },
  SETTINGS_MEDIA_SERVERS: {
    url: "/settings/media-servers",
  },
  SETTINGS_MEDIA_PROVIDERS: {
    url: "/settings/media-providers",
  },
  SETTINGS_NOTIFICATIONS: {
    url: "/settings/notifications-services",
  },
  SETTINGS_JOBS: {
    url: "/settings/jobs",
  },
  SETTINGS_GENERAL: {
    url: "/settings/general",
  },
  SETTINGS_SERVER_LOGS: {
    url: "/settings/logs",
  },

  /** MEDIA **/
  MOVIE: { url: (id: string) => "/movies/" + id },
  SERIES: { url: (id: string) => "/series/" + id },
  SEASON: {
    url: (id: string, seasonNumber: string) =>
      "/series/" + id + "/seasons/" + seasonNumber,
  },
  EPISODE: {
    url: (id: string, seasonNumber: string, episodeNumber: string) =>
      "/series/" +
      id +
      "/seasons/" +
      seasonNumber +
      "/episodes/" +
      episodeNumber,
  },

  /** SEARCH **/
  SEARCH: {
    url: (type: string, title: string) => "/search/" + type + "/" + title,
  },

  /** REQUESTS **/
  REQUESTS: {
    url: "/requests",
  },
  REQUESTS_SENT: {
    url: "/requests/outgoing",
  },
  REQUESTS_RECEIVED: {
    url: "/requests/incoming",
  },

  /** OTHERS **/
  NOT_FOUND: { url: "/404" },
};
