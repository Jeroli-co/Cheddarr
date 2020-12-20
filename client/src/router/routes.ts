import { NotFound } from "../components/elements/NotFound";
import { Home } from "../components/home/Home";
import { PageLoader } from "../components/elements/PageLoader";
import { ConfirmEmail } from "../components/auth/components/ConfirmEmail";
import { ResendEmailConfirmationModal } from "../components/auth/components/ResendEmailConfirmationModal";
import { ResetPassword } from "../components/auth/components/reset-password/ResetPassword";
import { InitResetPasswordModal } from "../components/auth/components/sign-in-form/init-reset-password-modal/InitResetPasswordModal";
import { SignInForm } from "../components/auth/components/sign-in-form/SignInForm";
import { SignUpForm } from "../components/auth/components/sign-up-form/SignUpForm";
import { FriendProfile } from "../components/user/FriendProfile";
import { Friends } from "../components/user/Friends";
import { Settings } from "../components/settings/Settings";
import { ChangeEmailModal } from "../components/settings/settings-account/element/ChangeEmailModal";
import { ChangePasswordModal } from "../components/settings/settings-account/element/ChangePasswordModal";
import { ChangeUsernameModal } from "../components/settings/settings-account/element/ChangeUsernameModal";
import { DeleteAccountModal } from "../components/settings/settings-account/element/DeleteAccountModal";
import { SettingsAccount } from "../components/settings/settings-account/SettingsAccount";
import { PlexConfig } from "../components/settings/settings-providers/plex-config/PlexConfig";
import { RadarrConfig } from "../components/settings/settings-providers/radarr-config/RadarrConfig";
import { SonarrConfig } from "../components/settings/settings-providers/sonarr-config/SonarrConfig";
import { MoviePage } from "../components/elements/media/MoviePage";
import { Search } from "../components/search/Search";
import { SeasonPage } from "../components/elements/media/SeasonPage";
import { SeriesPage } from "../components/elements/media/SeriesPage";
import { Requests } from "../components/requests/Requests";
import { RequestsSent } from "../components/requests/elements/RequestsSent";
import { RequestsReceived } from "../components/requests/elements/RequestsReceived";
import { User } from "../components/user/User";

const routes = {
  HOME: { url: "/", component: Home },
  SIGN_IN: { url: "/sign-in", component: SignInForm },
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
  RESEND_EMAIL_CONFIRMATION: {
    url: "/resend-email-confirmation",
    component: ResendEmailConfirmationModal,
  },
  NOT_FOUND: { url: "/404", component: NotFound },
  USER_PROFILE: { url: "/user", component: User },
  USER_FRIENDS: { url: "/user/friends", component: Friends },
  USER_FRIEND_PROFILE: {
    url: (username: string) => "/users/" + username,
    component: FriendProfile,
  },
  USER_SETTINGS: { url: "/settings", component: Settings },
  USER_SETTINGS_ACCOUNT: {
    url: "/settings/account",
    component: SettingsAccount,
  },
  CHANGE_PASSWORD: {
    url: "/settings/account/change-password",
    component: ChangePasswordModal,
  },
  CHANGE_USERNAME: {
    url: "/settings/account/change-username",
    component: ChangeUsernameModal,
  },
  CHANGE_EMAIL: {
    url: "/settings/account/change-email",
    component: ChangeEmailModal,
  },
  DELETE: { url: "/settings/account/delete", component: DeleteAccountModal },
  USER_SETTINGS_PLEX: {
    url: "/settings/plex",
    component: PlexConfig,
  },
  USER_SETTINGS_RADARR: {
    url: "/settings/radarr",
    component: RadarrConfig,
  },
  USER_SETTINGS_SONARR: {
    url: "/settings/sonarr",
    component: SonarrConfig,
  },
  MOVIE: { url: (id: string) => "/movie/" + id, component: MoviePage },
  SERIES: { url: (id: string) => "/series/" + id, component: SeriesPage },
  SEASON: {
    url: (seriesId: string, seasonId: string) =>
      "/series/" + seriesId + "/seasons/" + seasonId,
    component: SeasonPage,
  },
  SEARCH: {
    url: (type: string, title: string) => "/search/" + type + "/" + title,
    component: Search,
  },
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
};

export { routes };
