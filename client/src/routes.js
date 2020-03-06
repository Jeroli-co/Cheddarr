import React, {useContext} from 'react';
import { Route, Redirect } from "react-router-dom";
import {AuthContext} from "./context/AuthContext";
import {Home} from "./component/public/home/Home";
import {SignInForm} from "./component/protected/sign-in-form/SignInForm";
import {SignUpForm} from "./component/protected/sign-up-form/SignUpForm";
import {ConfirmAccount} from "./component/protected/confirm-account/ConfirmAccount";
import {WaitingAccountConfirmation} from "./component/protected/waiting-account-confirmation/WaitingAccountConfirmation";
import {ResetPasswordForm} from "./component/protected/reset-password-form/ResetPasswordForm";
import {UserProfile} from "./component/private/user-profile/UserProfile";
import {AuthorizeGoogle} from "./component/protected/authorize-google/AuthorizeGoogle";
import {AuthorizeFacebook} from "./component/protected/authorize-facebook/AuthorizeFacebook";

const ProtectedRoute = ({component: Component, ...rest}) => {

  const { isAuthenticated } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!isAuthenticated) {
          return<Component {...props} />
        } else {
          return <Redirect to={routes.HOME.url} />
        }
      }
    }/>
  )
};

const PrivateRoute = ({component: Component, ...rest}) => {

  const { isAuthenticated } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (isAuthenticated) {
          return<Component {...props} />
        } else {
          return <Redirect to={routes.HOME.url} />
        }
      }
    }/>
  )
};

const routes = {
  HOME: { url: '/', component: Home },
  SIGN_IN: { url: '/sign-in', component: SignInForm },
  SIGN_UP: { url: '/sign-up', component: SignUpForm },
  CONFIRM_ACCOUNT: { url: (token) => '/confirm/' + token, component: ConfirmAccount },
  WAIT_ACCOUNT_CONFIRMATION: { url: (email) => '/wait-account-confirmation/' + email, component: WaitingAccountConfirmation },
  RESET_PASSWORD: { url: (token) => '/reset/' + token, component: ResetPasswordForm },
  AUTHORIZE_GOOGLE: { url: '/authorize/google', component: AuthorizeGoogle },
  AUTHORIZE_FACEBOOK: { url: '/authorize/facebook', component: AuthorizeFacebook },
  USER_PROFILE: { url: 'user-profile', component: UserProfile }
};

export {
  ProtectedRoute,
  PrivateRoute,
  routes
};