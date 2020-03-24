import React from 'react';
import {Route, Switch} from "react-router-dom";
import {Navbar} from "./component/navbar/Navbar";
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import {routes} from "./routes";
import {PrivateRoute} from "./PrivateRoute";
import {ProtectedRoute} from "./ProtectedRoute";

const App = () => {

  config.autoAddCss = false;

  return (
    <div className="App">
      <Navbar />
      <Switch>
        <Route exact path={routes.HOME.url} component={routes.HOME.component} />
        <ProtectedRoute path={routes.SIGN_IN.url} component={routes.SIGN_IN.component} />
        <ProtectedRoute exact path={routes.SIGN_UP.url} component={routes.SIGN_UP.component} />
        <Route exact path={routes.CONFIRM_EMAIL.url(':token')} component={routes.CONFIRM_EMAIL.component} />
        <ProtectedRoute exaxt path={routes.WAIT_EMAIL_CONFIRMATION.url} component={routes.WAIT_EMAIL_CONFIRMATION.component} />
        <ProtectedRoute exact path={routes.RESET_PASSWORD.url(':token')} component={routes.RESET_PASSWORD.component} />
        <ProtectedRoute path={routes.AUTHORIZE.url} component={routes.AUTHORIZE.component} />
        <ProtectedRoute exact path={routes.RESEND_EMAIL_CONFIRMATION.url} component={routes.RESEND_EMAIL_CONFIRMATION.component} />
        <Route exact path={routes.INTERNAL_SERVER_ERROR.url} component={routes.INTERNAL_SERVER_ERROR.component} />
        <Route exact path={routes.BAD_REQUEST.url} component={routes.BAD_REQUEST.component} />
        <Route exact path={routes.NOT_FOUND.url} component={routes.NOT_FOUND.component} />

        <PrivateRoute path={routes.USER_PROFILE.url} component={routes.USER_PROFILE.component} />
        <PrivateRoute path={routes.USER_SETTINGS.url} component={routes.USER_SETTINGS.component} />

        <Route exact path={routes.USER_PUBLIC_PROFILE.url(':id')} component={routes.USER_PUBLIC_PROFILE.component} />

        <Route path="*" component={routes.NOT_FOUND.component} />
      </Switch>
    </div>
  );
};

export {
  App
};
