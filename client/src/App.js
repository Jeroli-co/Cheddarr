import React from 'react';
import {Route, Switch} from "react-router-dom";
import './App.css';
import {Navbar} from "./component/navbar/Navbar";
import {SignInForm} from "./component/protected/sign-in-form/SignInForm";
import {SignUpForm} from "./component/protected/sign-up-form/SignUpForm";
import {Home} from "./component/public/home/Home";
import AuthContextProvider from "./context/AuthContext";
import {UserProfile} from "./component/private/user-profile/UserProfile";
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import {ProtectedRoute, PrivateRoute} from "./routes";
import {ConfirmAccount} from "./component/protected/confirm-account/ConfirmAccount";
import {WaitingAccountConfirmation} from "./component/protected/waiting-account-confirmation/WaitingAccountConfirmation";
import {ResetPasswordForm} from "./component/protected/reset-password-form/ResetPasswordForm";
import {NotFound} from "./component/public/not-found/NotFound";

const App = () => {

  config.autoAddCss = false;

  return (
    <div className="App">
      <AuthContextProvider>
        <Navbar />
        <Switch>
          <Route exact path='/' component={Home} />

          <ProtectedRoute exact path='/sign-in' component={SignInForm} />
          <ProtectedRoute exact path='/sign-up' component={SignUpForm} />
          <ProtectedRoute exact path='/confirm/:token' component={ConfirmAccount} />
          <ProtectedRoute exaxt path='/wait-account-confirmation/:email' component={WaitingAccountConfirmation} />
          <ProtectedRoute exact path='/reset/:token' component={ResetPasswordForm} />
          {/* TODO: Redirect full url <ProtectedRoute path='/authorize/google' component={} /> */}
          {
            // Delete protected route and handle it with '/' redirection
          }

          <PrivateRoute exact path="/user-profile" component={UserProfile} />

          <Route path="*" component={NotFound} />
        </Switch>
      </AuthContextProvider>
    </div>
  );
};

export default App;
