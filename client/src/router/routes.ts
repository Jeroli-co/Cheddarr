import { NotFound } from "../shared/components/errors/NotFound";
import { PageLoader } from "../shared/components/PageLoader";
import { ConfirmEmail } from "../logged-out-app/elements/ConfirmEmail";
import { ResetPassword } from "../logged-out-app/elements/ResetPassword";
import { SignInForm } from "../logged-out-app/SignInForm";
import { SignUpForm } from "../logged-out-app/SignUpForm";
import { PublicUser } from "../logged-in-app/pages/PublicUser";
import { Friends } from "../logged-in-app/pages/user-profile/friends/Friends";
import { Settings } from "../logged-in-app/pages/settings/Settings";
import { SettingsAccount } from "../logged-in-app/pages/settings/components/account/SettingsAccount";
import { PlexConfig } from "../logged-in-app/pages/settings/components/plex/PlexConfig";
import { RadarrConfig } from "../logged-in-app/pages/settings/components/RadarrConfig";
import { SonarrConfig } from "../logged-in-app/pages/settings/components/SonarrConfig";
import { Search } from "../logged-in-app/pages/search/Search";
import { Requests } from "../logged-in-app/pages/requests/Requests";
import { UserProfile } from "../logged-in-app/pages/user-profile/UserProfile";
import { PlexMovie } from "../logged-in-app/pages/plex-media/PlexMovie";
import { PlexSeries } from "../logged-in-app/pages/plex-media/PlexSeries";
import { PlexSeason } from "../logged-in-app/pages/plex-media/PlexSeason";
import { Home } from "../shared/Home";
import { RequestsSent } from "../logged-in-app/pages/requests/elements/RequestsSent";
import { RequestsReceived } from "../logged-in-app/pages/requests/elements/RequestsReceived";
import { Profile } from "../logged-in-app/pages/user-profile/Profile";

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
  CONFIRM_EMAIL: {
    url: (token: string) => "/sign-up/" + token,
    component: ConfirmEmail,
  },
  RESET_PASSWORD: {
    url: (token: string) => "/me/password/" + token,
    component: ResetPassword,
  },

  /** USERS **/
  PROFILE: { url: "/user", component: Profile },
  USER_PROFILE: { url: "/user/profile", component: UserProfile },
  USER_FRIENDS: { url: "/user/friends", component: Friends },
  PUBLIC_USER: {
    url: (username: string) => "/users/" + username,
    component: PublicUser,
  },

  /** SETTINGS **/
  SETTINGS: { url: "/settings", component: Settings },
  SETTINGS_ACCOUNT: {
    url: "/settings/account",
    component: SettingsAccount,
  },
  SETTINGS_PLEX: {
    url: "/settings/plex",
    component: PlexConfig,
  },
  SETTINGS_RADARR: {
    url: "/settings/radarr",
    component: RadarrConfig,
  },
  SETTINGS_SONARR: {
    url: "/settings/sonarr",
    component: SonarrConfig,
  },

  /** PLEX **/
  MOVIE: { url: (id: string) => "/movie/" + id, component: PlexMovie },
  SERIES: { url: (id: string) => "/series/" + id, component: PlexSeries },
  SEASON: { url: (id: string) => "/seasons/" + id, component: PlexSeason },

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
    url: "/requests/sent",
    component: RequestsSent,
  },
  REQUESTS_RECEIVED: {
    url: "/requests/received",
    component: RequestsReceived,
  },

  /** OTHERS **/
  NOT_FOUND: { url: "/404", component: NotFound },
};

export { routes };
