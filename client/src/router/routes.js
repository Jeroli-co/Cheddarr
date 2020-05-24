import { Home } from "../elements/home/Home";
import { SignInForm } from "../modules/auth/sign-in-form/SignInForm";
import { SignUpForm } from "../modules/auth/SignUpForm";
import { ConfirmEmail } from "../modules/auth/confirm-email/ConfirmEmail";
import { WaitingEmailConfirmation } from "../modules/auth/WaitingEmailConfirmation";
import { ResetPassword } from "../modules/auth/reset-password/ResetPassword";
import { Profile } from "../modules/profile/Profile";
import { NotFound } from "../elements/errors/NotFound";
import { Settings } from "../modules/settings/Settings";
import { InternalServerError } from "../elements/errors/InternalServerError";
import { ResendEmailConfirmationModal } from "../modules/auth/elements/ResendEmailConfirmationModal";
import { InitResetPasswordModal } from "../modules/auth/sign-in-form/init-reset-password-modal/InitResetPasswordModal";
import { BadRequest } from "../elements/errors/BadRequest";
import { FriendProfile } from "../modules/profile/friends/elements/FriendProfile";
import { Friends } from "../modules/profile/friends/Friends";
import { PageLoader } from "../elements/PageLoader";
import { SettingsAccount } from "../modules/settings/settings-account/SettingsAccount";
import { ChangeEmailModal } from "../modules/settings/settings-account/element/ChangeEmailModal";
import { ChangeUsernameModal } from "../modules/settings/settings-account/element/ChangeUsernameModal";
import { ChangePasswordModal } from "../modules/settings/settings-account/element/ChangePasswordModal";
import { SonarrConfig } from "../modules/settings/settings-providers/sonarr-config/SonarrConfig";
import { RadarrConfig } from "../modules/settings/settings-providers/radarr-config/RadarrConfig";
import { PlexConfig } from "../modules/settings/settings-providers/plex-config/PlexConfig";
import { DeleteAccountModal } from "../modules/settings/settings-account/element/DeleteAccountModal";
import { MoviePage } from "../pages/MoviePage";
import { SeasonPage } from "../pages/SeasonPage";
import { SeriesPage } from "../pages/SeriesPage";
import { SearchPage } from "../pages/search-page/SearchPage";

const routes = {
  HOME: { url: "/", component: Home },
  SIGN_IN: { url: "/sign-in", component: SignInForm },
  AUTHORIZE_PLEX: { url: "/sign-in/plex/authorize/", component: PageLoader },
  INIT_RESET_PASSWORD: {
    url: "/sign-in/init-reset-password",
    component: InitResetPasswordModal,
  },
  SIGN_UP: { url: "/sign-up", component: SignUpForm },
  CONFIRM_EMAIL: {
    url: (token) => "/confirm/" + token,
    component: ConfirmEmail,
  },
  WAIT_EMAIL_CONFIRMATION: {
    url: (email) => "/wait-email-confirmation/" + email,
    component: WaitingEmailConfirmation,
  },
  RESET_PASSWORD: {
    url: (token) => "/reset/" + token,
    component: ResetPassword,
  },
  RESEND_EMAIL_CONFIRMATION: {
    url: "/resend-email-confirmation",
    component: ResendEmailConfirmationModal,
  },
  INTERNAL_SERVER_ERROR: { url: "/500", component: InternalServerError },
  BAD_REQUEST: { url: "/400", component: BadRequest },
  NOT_FOUND: { url: "/404", component: NotFound },
  USER_PROFILE: { url: "/profile", component: Profile },
  USER_FRIENDS: { url: "/profile/friends", component: Friends },
  USER_FRIEND_PROFILE: {
    url: (username) => "/users/" + username,
    component: FriendProfile,
  },
  USER_SETTINGS: { url: "/settings", component: Settings },
  USER_SETTINGS_ACCOUNT: {
    url: "/settings/account",
    component: SettingsAccount,
  },
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
  CHANGE_PASSWORD: {
    url: "/settings/profile/change-password",
    component: ChangePasswordModal,
  },
  CHANGE_USERNAME: {
    url: "/settings/profile/change-username",
    component: ChangeUsernameModal,
  },
  CHANGE_EMAIL: {
    url: "/settings/profile/change-email",
    component: ChangeEmailModal,
  },
  DELETE: { url: "/settings/profile/delete", component: DeleteAccountModal },
  MOVIE: { url: (id) => "/movie/" + id, component: MoviePage },
  SERIES: { url: (id) => "/series/" + id, component: SeriesPage },
  SEASON: {
    url: (seriesId, seasonNumber) =>
      "/series/" + seriesId + "/seasons/" + seasonNumber,
    component: SeasonPage,
  },
  SEARCH: {
    url: (type) => "/search/" + type,
    component: SearchPage,
  },
};

export { routes };
