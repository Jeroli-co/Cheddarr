import { NotFound } from "../shared/components/errors/NotFound";
import { PageLoader } from "../shared/components/PageLoader";
import { ConfirmEmail } from "../logged-out-app/pages/ConfirmEmail";
import { ResetPassword } from "../logged-out-app/pages/reset-password/ResetPassword";
import { InitResetPasswordModal } from "../logged-out-app/pages/sign-in/components/InitResetPasswordModal";
import { SignInForm } from "../logged-out-app/pages/sign-in/SignInForm";
import { SignUpForm } from "../logged-out-app/pages/sign-up/SignUpForm";
import { PublicUser } from "../logged-in-app/pages/PublicUser";
import { Friends } from "../logged-in-app/pages/user-profile/friends/Friends";
import { Settings } from "../logged-in-app/pages/settings/Settings";
import { ChangeEmailModal } from "../logged-in-app/pages/settings/components/account/components/ChangeEmailModal";
import { ChangePasswordModal } from "../logged-in-app/pages/settings/components/account/components/ChangePasswordModal";
import { ChangeUsernameModal } from "../logged-in-app/pages/settings/components/account/components/ChangeUsernameModal";
import { DeleteAccountModal } from "../logged-in-app/pages/settings/components/account/components/DeleteAccountModal";
import { SettingsAccount } from "../logged-in-app/pages/settings/components/account/SettingsAccount";
import { PlexConfig } from "../logged-in-app/pages/settings/components/plex/PlexConfig";
import { RadarrConfig } from "../logged-in-app/pages/settings/components/RadarrConfig";
import { SonarrConfig } from "../logged-in-app/pages/settings/components/SonarrConfig";
import { Search } from "../logged-in-app/pages/search/Search";
import { Requests } from "../logged-in-app/pages/requests/Requests";
import { UserProfile } from "../logged-in-app/pages/user-profile/UserProfile";
import { RequestsSentDashboard } from "../logged-in-app/pages/requests/components/requests-sent/RequestsSentDashboard";
import { RequestsReceivedDashboard } from "../logged-in-app/pages/requests/components/requests-received/RequestsReceivedDashboard";
import { PlexMovie } from "../logged-in-app/pages/plex-media/PlexMovie";
import { PlexSeries } from "../logged-in-app/pages/plex-media/PlexSeries";
import { PlexSeason } from "../logged-in-app/pages/plex-media/PlexSeason";
import { Home } from "../shared/Home";

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
  INIT_RESET_PASSWORD: {
    url: "/sign-in/init-reset-password",
    component: InitResetPasswordModal,
  },
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
  USER_PROFILE: { url: "/user", component: UserProfile },
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
  CHANGE_PASSWORD_MODAL: {
    url: "/settings/account/change-password",
    component: ChangePasswordModal,
  },
  CHANGE_USERNAME_MODAL: {
    url: "/settings/account/change-username",
    component: ChangeUsernameModal,
  },
  CHANGE_EMAIL_MODAL: {
    url: "/settings/account/change-email",
    component: ChangeEmailModal,
  },
  DELETE_ACCOUNT_MODAL: {
    url: "/settings/account/delete",
    component: DeleteAccountModal,
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
    component: RequestsSentDashboard,
  },
  REQUESTS_RECEIVED: {
    url: "/requests/received",
    component: RequestsReceivedDashboard,
  },

  /** OTHERS **/
  NOT_FOUND: { url: "/404", component: NotFound },
};

export { routes };
