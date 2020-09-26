import { BadRequest } from "../elements/errors/BadRequest";
import { InternalServerError } from "../elements/errors/InternalServerError";
import { NotFound } from "../elements/errors/NotFound";
import { Home } from "../elements/home/Home";
import { PageLoader } from "../elements/PageLoader";
import { ConfirmEmail } from "../modules/auth/confirm-email/ConfirmEmail";
import { ResendEmailConfirmationModal } from "../modules/auth/elements/ResendEmailConfirmationModal";
import { ResetPassword } from "../modules/auth/reset-password/ResetPassword";
import { InitResetPasswordModal } from "../modules/auth/sign-in-form/init-reset-password-modal/InitResetPasswordModal";
import { SignInForm } from "../modules/auth/sign-in-form/SignInForm";
import { SignUpForm } from "../modules/auth/sign-up-form/SignUpForm";
import { FriendProfile } from "../modules/user/friends/elements/FriendProfile";
import { Friends } from "../modules/user/friends/Friends";
import { Profile } from "../modules/user/profile/Profile";
import { Settings } from "../modules/settings/Settings";
import { ChangeEmailModal } from "../modules/settings/settings-account/element/ChangeEmailModal";
import { ChangePasswordModal } from "../modules/settings/settings-account/element/ChangePasswordModal";
import { ChangeUsernameModal } from "../modules/settings/settings-account/element/ChangeUsernameModal";
import { DeleteAccountModal } from "../modules/settings/settings-account/element/DeleteAccountModal";
import { SettingsAccount } from "../modules/settings/settings-account/SettingsAccount";
import { PlexConfig } from "../modules/settings/settings-providers/plex-config/PlexConfig";
import { RadarrConfig } from "../modules/settings/settings-providers/radarr-config/RadarrConfig";
import { SonarrConfig } from "../modules/settings/settings-providers/sonarr-config/SonarrConfig";
import { MoviePage } from "../pages/MoviePage";
import { SearchPage } from "../pages/search-page/SearchPage";
import { SeasonPage } from "../pages/SeasonPage";
import { SeriesPage } from "../pages/SeriesPage";
import { Requests } from "../modules/requests/Requests";
import { RequestsSent } from "../modules/requests/elements/RequestsSent";
import { RequestsReceived } from "../modules/requests/elements/RequestsReceived";

const routes = {
  HOME: { url: "/", component: Home },
  SIGN_IN: { url: "/sign-in", component: SignInForm },
  CONFIRM_PLEX_SIGNIN: { url: "/sign-in/plex/confirm/", component: PageLoader },
  INIT_RESET_PASSWORD: {
    url: "/sign-in/init-reset-password",
    component: InitResetPasswordModal,
  },
  SIGN_UP: { url: "/sign-up", component: SignUpForm },
  CONFIRM_EMAIL: {
    url: (token) => "/sign-up/confirm/" + token,
    component: ConfirmEmail,
  },
  RESET_PASSWORD: {
    url: (token) => "/user/password/reset/" + token,
    component: ResetPassword,
  },
  RESEND_EMAIL_CONFIRMATION: {
    url: "/resend-email-confirmation",
    component: ResendEmailConfirmationModal,
  },
  INTERNAL_SERVER_ERROR: { url: "/500", component: InternalServerError },
  BAD_REQUEST: { url: "/400", component: BadRequest },
  NOT_FOUND: { url: "/404", component: NotFound },
  USER_PROFILE: { url: "/user", component: Profile },
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
    component: SearchPage,
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
