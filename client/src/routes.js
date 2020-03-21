import {Home} from "./component/public/home/Home";
import {SignInForm} from "./component/protected/sign-in-form/SignInForm";
import {SignUpForm} from "./component/protected/sign-up-form/SignUpForm";
import {ConfirmEmail} from "./component/protected/confirm-email/ConfirmEmail";
import {WaitingAccountConfirmation} from "./component/protected/waiting-account-confirmation/WaitingAccountConfirmation";
import {ResetPassword} from "./component/protected/reset-password/ResetPassword";
import {UserProfile} from "./component/private/user-profile/UserProfile";
import {Authorize} from "./component/protected/authorize/Authorize";
import {NotFound} from "./component/public/not-found/NotFound";
import {UserSettings} from "./component/private/user-settings/UserSettings";
import {InternalServerError} from "./component/public/internal-server-error/InternalServerError";
import {ConfirmPasswordModal} from "./component/element/confirm-password-modal/ConfirmPasswordModal";

const routes = {
  HOME: { url: '/', component: Home },
  NOT_FOUND: { url: '/404', component: NotFound },
  INTERNAL_SERVER_ERROR: { url: '/500', component: InternalServerError },
  SIGN_IN: { url: '/sign-in', component: SignInForm },
  SIGN_UP: { url: '/sign-up', component: SignUpForm },
  CONFIRM_EMAIL: { url: (token) => '/confirm/' + token, component: ConfirmEmail },
  WAIT_ACCOUNT_CONFIRMATION: { url: (email) => '/wait-account-confirmation/' + email, component: WaitingAccountConfirmation },
  RESET_PASSWORD: { url: (token) => '/reset/' + token, component: ResetPassword },
  AUTHORIZE: { url: '/sign-in/authorize', component: Authorize },
  CONFIRM_PASSWORD: { url: '/confirm-password', component: ConfirmPasswordModal },
  USER_PROFILE: { url: '/profile', component: UserProfile },
  USER_SETTINGS: { url: '/settings', component: UserSettings }
};

export {
  routes
};