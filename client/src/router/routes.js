import { NotFound } from "../utils/elements/NotFound";
import { Home } from "../modules/home/Home";
import { PageLoader } from "../utils/elements/PageLoader";
import { ConfirmEmail } from "../modules/auth/components/ConfirmEmail";
import { ResendEmailConfirmationModal } from "../modules/auth/components/ResendEmailConfirmationModal";
import { ResetPassword } from "../modules/auth/components/reset-password/ResetPassword";
import { InitResetPasswordModal } from "../modules/auth/components/sign-in-form/init-reset-password-modal/InitResetPasswordModal";
import { SignInForm } from "../modules/auth/components/sign-in-form/SignInForm";
import { SignUpForm } from "../modules/auth/components/sign-up-form/SignUpForm";
import { FriendProfile } from "../modules/user/friends/elements/FriendProfile";
import { Friends } from "../modules/user/friends/Friends";
import { Settings } from "../modules/settings/Settings";
import { ChangeEmailModal } from "../modules/settings/settings-account/element/ChangeEmailModal";
import { ChangePasswordModal } from "../modules/settings/settings-account/element/ChangePasswordModal";
import { ChangeUsernameModal } from "../modules/settings/settings-account/element/ChangeUsernameModal";
import { DeleteAccountModal } from "../modules/settings/settings-account/element/DeleteAccountModal";
import { SettingsAccount } from "../modules/settings/settings-account/SettingsAccount";
import { PlexConfig } from "../modules/settings/settings-providers/plex-config/PlexConfig";
import { RadarrConfig } from "../modules/settings/settings-providers/radarr-config/RadarrConfig";
import { SonarrConfig } from "../modules/settings/settings-providers/sonarr-config/SonarrConfig";
import { MoviePage } from "../utils/elements/media/MoviePage";
import { SearchOnline } from "../modules/search/search-online/SearchOnline";
import { SeasonPage } from "../utils/elements/media/SeasonPage";
import { SeriesPage } from "../utils/elements/media/SeriesPage";
import { Requests } from "../modules/requests/Requests";
import { RequestsSent } from "../modules/requests/elements/RequestsSent";
import { RequestsReceived } from "../modules/requests/elements/RequestsReceived";
import { User } from "../modules/user/User";

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
    url: (token) => "/sign-up/" + token,
    component: ConfirmEmail,
  },
  RESET_PASSWORD: {
    url: (token) => "/me/password/" + token,
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
    url: (username) => "/users/" + username,
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
  MOVIE: { url: (id) => "/movie/" + id, component: MoviePage },
  SERIES: { url: (id) => "/series/" + id, component: SeriesPage },
  SEASON: {
    url: (seriesId, seasonId) => "/series/" + seriesId + "/seasons/" + seasonId,
    component: SeasonPage,
  },
  SEARCH: {
    url: (type, title) => "/search/" + type + "/" + title,
    component: SearchOnline,
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
