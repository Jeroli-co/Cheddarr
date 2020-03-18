import {Home} from "./component/public/home/Home";
import {SignInForm} from "./component/protected/sign-in-form/SignInForm";
import {SignUpForm} from "./component/protected/sign-up-form/SignUpForm";
import {ConfirmAccount} from "./component/protected/confirm-account/ConfirmAccount";
import {WaitingAccountConfirmation} from "./component/protected/waiting-account-confirmation/WaitingAccountConfirmation";
import {ResetPassword} from "./component/protected/reset-password/ResetPassword";
import {UserProfile} from "./component/private/user-profile/UserProfile";
import {Authorize} from "./component/protected/authorize/Authorize";
import {NotFound} from "./component/public/not-found/NotFound";
import {UserSettings} from "./component/private/user-settings/UserSettings";
import {InternalServerError} from "./component/public/internal-server-error/InternalServerError";

const routes = {
  HOME: { url: '/', component: Home },
  NOT_FOUND: { url: '/404', component: NotFound },
  INTERNAL_SERVER_ERROR: { url: '/500', component: InternalServerError },
  SIGN_IN: { url: '/sign-in', component: SignInForm },
  SIGN_UP: { url: '/sign-up', component: SignUpForm },
  CONFIRM_ACCOUNT: { url: (token) => '/confirm/' + token, component: ConfirmAccount },
  WAIT_ACCOUNT_CONFIRMATION: { url: (email) => '/wait-account-confirmation/' + email, component: WaitingAccountConfirmation },
  RESET_PASSWORD: { url: (token) => '/reset/' + token, component: ResetPassword },
  AUTHORIZE: { url: '/sign-in/authorize', component: Authorize },
  USER_PROFILE: { url: (username) => '/user/' + username, component: UserProfile },
  USER_SETTINGS: { url: '/settings', component: UserSettings },
  USER_SETTINGS_PROFILE: { url: '/settings', component: UserSettings },
  USER_SETTINGS_CONFIGURATIONS: { url: '/settings/configurations', component: UserSettings }
};

export {
  routes
};