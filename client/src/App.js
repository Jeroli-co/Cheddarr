import React from 'react';
import {Route, Switch} from "react-router-dom";
import {Navbar} from "./component/navbar/Navbar";
import AuthContextProvider from "./context/AuthContext";
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import {routes} from "./routes";
import {PrivateRoute} from "./PrivateRoute";
import {ProtectedRoute} from "./ProtectedRoute";

const App = () => {

  config.autoAddCss = false;

  return (
    <div className="App">
      <AuthContextProvider>
        <Navbar />
        <Switch>
          <Route exact path={routes.HOME.url} component={routes.HOME.component} />

          <ProtectedRoute exact path={routes.SIGN_IN.url} component={routes.SIGN_IN.component} />
          <ProtectedRoute exact path={routes.SIGN_UP.url} component={routes.SIGN_UP.component} />
          <ProtectedRoute exact path={routes.CONFIRM_ACCOUNT.url(':token')} component={routes.CONFIRM_ACCOUNT.component} />
          <ProtectedRoute exaxt path={routes.WAIT_ACCOUNT_CONFIRMATION.url(':email')} component={routes.WAIT_ACCOUNT_CONFIRMATION.component} />
          <ProtectedRoute exact path={routes.RESET_PASSWORD.url(':token')} component={routes.RESET_PASSWORD.component} />
          <ProtectedRoute path={routes.AUTHORIZE.url} component={routes.AUTHORIZE.component} />

          <PrivateRoute exact path={routes.USER_PROFILE.url} component={routes.USER_PROFILE.component} />

          <PrivateRoute path={routes.USER_SETTINGS.url} component={routes.USER_SETTINGS.component} />

          <Route path={routes.CONFIRM_PASSWORD.url} component={routes.CONFIRM_PASSWORD.component} />

          <Route exact path={routes.NOT_FOUND.url} component={routes.NOT_FOUND.component} />
          <Route exact path={routes.INTERNAL_SERVER_ERROR.url} component={routes.INTERNAL_SERVER_ERROR.component} />

          <Route path="*" component={routes.NOT_FOUND.component} />
        </Switch>
      </AuthContextProvider>
    </div>
  );
};

export {
  App
};
