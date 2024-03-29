import { NotFound } from "../shared/components/errors/NotFound";
import { PageLoader } from "../shared/components/PageLoader";
import { ResetPassword } from "../logged-out-app/elements/ResetPassword";
import { SignInForm } from "../logged-out-app/SignInForm";
import { SignUpForm } from "../logged-out-app/SignUpForm";
import { Settings } from "../logged-in-app/pages/settings/Settings";
import { Requests } from "../logged-in-app/pages/Requests";
import { Home } from "../shared/Home";
import { RequestsSent } from "../shared/components/requests/RequestsSent";
import { RequestsReceived } from "../shared/components/requests/RequestsReceived";
import { Profile } from "../logged-in-app/pages/user-profile/Profile";
import { MediaServersSettings } from "../logged-in-app/pages/settings/media-servers/MediaServersSettings";
import { MediaProvidersSettings } from "../logged-in-app/pages/settings/media-providers/MediaProvidersSettings";
import { NotificationsServicesSettings } from "../logged-in-app/pages/settings/notifications/NotificationsServicesSettings";
import { Search } from "../logged-in-app/pages/Search";
import { Movie } from "../shared/components/media/Movie";
import { Series } from "../shared/components/media/Series";
import { JobsSettings } from "../logged-in-app/pages/settings/jobs/JobsSettings";
import { UsersSettings } from "../logged-in-app/pages/settings/users/UsersSettings";
import { GeneralSettings } from "../logged-in-app/pages/settings/general/GeneralSettings";
import { ServerLogs } from "../logged-in-app/pages/settings/server-logs/ServerLogs";

const routes = {
  HOME: {
    url: "/",
    component: Home,
  },

  /** AUTH **/
  SIGN_IN: {
    url: (redirectURI?: string) =>
      redirectURI ? "/sign-in?redirectURI=" + redirectURI : "/sign-in",
    component: SignInForm,
  },
  CONFIRM_PLEX_SIGNIN: { url: "/sign-in/plex/confirm", component: PageLoader },
  SIGN_UP: { url: "/sign-up", component: SignUpForm },
  RESET_PASSWORD: {
    url: (token: string) => "/me/password/" + token,
    component: ResetPassword,
  },

  /** USERS **/
  USERS: { url: "/users", component: UsersSettings },
  PROFILE: {
    url: (id?: number | string) => `/profile${id ? `/${id}` : ""}`,
    component: Profile,
  },

  /** SETTINGS **/
  SETTINGS: { url: "/settings", component: Settings },
  SETTINGS_MEDIA_SERVERS: {
    url: "/settings/media-servers",
    component: MediaServersSettings,
  },
  SETTINGS_MEDIA_PROVIDERS: {
    url: "/settings/media-providers",
    component: MediaProvidersSettings,
  },
  SETTINGS_NOTIFICATIONS: {
    url: "/settings/notifications",
    component: NotificationsServicesSettings,
  },
  SETTINGS_JOBS: {
    url: "/settings/jobs",
    component: JobsSettings,
  },
  SETTINGS_GENERAL: {
    url: "/settings/general",
    component: GeneralSettings,
  },
  SETTINGS_SERVER_LOGS: {
    url: "/settings/logs",
    component: ServerLogs,
  },

  /** MEDIA **/
  MOVIE: { url: (id: string) => "/movies/" + id, component: Movie },
  SERIES: { url: (id: string) => "/series/" + id, component: Series },
  SEASON: {
    url: (id: string, seasonNumber: string) =>
      "/series/" + id + "/seasons/" + seasonNumber,
    component: Series,
  },
  EPISODE: {
    url: (id: string, seasonNumber: string, episodeNumber: string) =>
      "/series/" +
      id +
      "/seasons/" +
      seasonNumber +
      "/episodes/" +
      episodeNumber,
    component: Series,
  },

  /** SEARCH **/
  SEARCH: {
    url: (type: string, title: string) => "/search/" + type + "/" + title,
    component: Search,
  },

  /** REQUESTS **/
  REQUESTS: {
    url: "/requests",
    component: Requests,
  },
  REQUESTS_SENT: {
    url: "/requests/outgoing",
    component: RequestsSent,
  },
  REQUESTS_RECEIVED: {
    url: "/requests/incoming",
    component: RequestsReceived,
  },

  /** OTHERS **/
  NOT_FOUND: { url: "/404", component: NotFound },
};

export { routes };
