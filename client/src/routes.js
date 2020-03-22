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

const routes = {
  HOME: { url: '/', component: Home },
  NOT_FOUND: { url: '/404', component: NotFound },
  INTERNAL_SERVER_ERROR: { url: '/500', component: InternalServerError },
  BAD_REQUEST: { url: '/400', component: BadRequest },

  SIGN_IN: { url: '/sign-in', component: SignInForm },
  INIT_RESET_PASSWORD: { url: '/sign-in/init-reset-password', component: InitResetPasswordModal },

  SIGN_UP: { url: '/sign-up', component: SignUpForm },
  CONFIRM_EMAIL: { url: (token) => '/confirm/' + token, component: ConfirmEmail },
  WAIT_EMAIL_CONFIRMATION: { url: '/wait-email-confirmation', component: WaitingEmailConfirmation },
  RESEND_EMAIL_CONFIRMATION: { url: '/resend-email-confirmation', component: ResendEmailConfirmationModal },
  RESET_PASSWORD: { url: (token) => '/reset/' + token, component: ResetPassword },
  AUTHORIZE: { url: '/authorize', component: Authorize },
  USER_PROFILE: { url: '/profile', component: UserProfile },
  USER_SETTINGS: { url: '/settings', component: UserSettings }
};

export {
  routes
};