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
import { SettingsProfile } from "../modules/settings/settings-profile/SettingsProfile";
import { ChangePasswordModal } from "../modules/settings/settings-profile/element/ChangePasswordModal";
import { ChangeUsernameModal } from "../modules/settings/settings-profile/element/ChangeUsernameModal";
import { ChangeEmailModal } from "../modules/settings/settings-profile/element/ChangeEmailModal";
import { DeleteAccountModal } from "../modules/settings/settings-profile/element/DeleteAccountModal";
import { FriendProfile } from "../modules/profile/friends/elements/FriendProfile";
import { Friends } from "../modules/profile/friends/Friends";
import { PageLoader } from "../elements/PageLoader";
import { PlexConfig } from "../modules/settings/settings-configurations/plex-config/PlexConfig";
import { RadarrConfig } from "../modules/settings/settings-configurations/radarr-config/RadarrConfig";
import { SonarrConfig } from "../modules/settings/settings-configurations/sonarr-config/SonarrConfig";

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
  USER_SETTINGS_PROFILE: {
    url: "/settings/profile",
    component: SettingsProfile,
  },
  USER_SETTINGS_CONFIGURATIONS_PLEX: {
    url: "/settings/configurations/plex",
    component: PlexConfig,
  },
  USER_SETTINGS_CONFIGURATIONS_RADARR: {
    url: "/settings/configurations/radarr",
    component: RadarrConfig,
  },
  USER_SETTINGS_CONFIGURATIONS_SONARR: {
    url: "/settings/configurations/sonarr",
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
};

export { routes };
