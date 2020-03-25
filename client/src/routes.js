import {Home} from "./component/public/home/Home";
import {SignInForm} from "./component/protected/sign-in-form/SignInForm";
import {SignUpForm} from "./component/protected/sign-up-form/SignUpForm";
import {ConfirmEmail} from "./component/public/confirm-email/ConfirmEmail";
import {WaitingEmailConfirmation} from "./component/protected/waiting-email-confirmation/WaitingEmailConfirmation";
import {ResetPassword} from "./component/protected/reset-password/ResetPassword";
import {UserProfile} from "./component/private/user-profile/UserProfile";
import {Authorize} from "./component/protected/authorize/Authorize";
import {NotFound} from "./component/public/errors/not-found/NotFound";
import {UserSettings} from "./component/private/user-settings/UserSettings";
import {InternalServerError} from "./component/public/errors/internal-server-error/InternalServerError";
import {ResendEmailConfirmationModal} from "./component/protected/element/resend-email-confirmation-modal/ResendEmailConfirmationModal";
import {InitResetPasswordModal} from "./component/protected/element/init-reset-password-modal/InitResetPasswordModal";
import {BadRequest} from "./component/public/errors/bad-request/BadRequest";
import {UserSettingsProfile} from "./component/private/user-settings/element/user-settings-profile/UserSettingsProfile";
import {UserSettingsConfigurations} from "./component/private/user-settings/element/user-settings-configurations/UserSettingsConfigurations";
import {ChangePasswordModal} from "./component/private/user-settings/element/user-settings-profile/element/change-password-modal/ChangePasswordModal";
import {ChangeUsernameModal} from "./component/private/user-settings/element/user-settings-profile/element/change-username-modal/ChangeUsernameModal";
import {ChangeEmailModal} from "./component/private/user-settings/element/user-settings-profile/element/change-email-modal/ChangeEmailModal";
import {DeleteAccountModal} from "./component/private/user-settings/element/user-settings-profile/element/delete-account-modal/DeleteAccountModal";
import {UserPublicProfile} from "./component/private/user-public-profile/UserPublicProfile";
import {UserFriendsList} from "./component/private/user-profile/element/user-friends-list/UserFriendsList";

const routes = {
  HOME: { url: '/', component: Home },
  SIGN_IN: { url: '/sign-in', component: SignInForm },
  INIT_RESET_PASSWORD: { url: '/sign-in/init-reset-password', component: InitResetPasswordModal },
  SIGN_UP: { url: '/sign-up', component: SignUpForm },
  CONFIRM_EMAIL: { url: (token) => '/confirm/' + token, component: ConfirmEmail },
  WAIT_EMAIL_CONFIRMATION: { url: '/wait-email-confirmation', component: WaitingEmailConfirmation },
  RESET_PASSWORD: { url: (token) => '/reset/' + token, component: ResetPassword },
  AUTHORIZE: { url: '/authorize', component: Authorize },
  RESEND_EMAIL_CONFIRMATION: { url: '/resend-email-confirmation', component: ResendEmailConfirmationModal },
  INTERNAL_SERVER_ERROR: { url: '/500', component: InternalServerError },
  BAD_REQUEST: { url: '/400', component: BadRequest },
  NOT_FOUND: { url: '/404', component: NotFound },
  USER_PROFILE: { url: '/profile', component: UserProfile },
  USER_FRIENDS_LIST: { url: '/profile/friends', component: UserFriendsList },
  USER_PUBLIC_PROFILE: { url: (username) => '/users/' + username, component: UserPublicProfile },
  USER_SETTINGS: { url: '/settings', component: UserSettings },
  USER_SETTINGS_PROFILE: { url: '/settings/profile', component: UserSettingsProfile },
  CHANGE_PASSWORD: { url: '/settings/profile/change-password', component: ChangePasswordModal },
  CHANGE_USERNAME: { url: '/settings/profile/change-username', component: ChangeUsernameModal },
  CHANGE_EMAIL: { url: '/settings/profile/change-email', component: ChangeEmailModal },
  DELETE: { url: '/settings/profile/delete', component: DeleteAccountModal },
  USER_SETTINGS_CONFIGURATIONS: { url: '/settings/configurations', component: UserSettingsConfigurations }
};

export {
  routes
};