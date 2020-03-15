import React from 'react';
import {Route, Switch} from "react-router-dom";
import {Navbar} from "./component/navbar/Navbar";
import AuthContextProvider from "./context/AuthContext";
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import {routes} from "./routes";
import {NotFound} from "./component/public/errors/Errors";
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

          <Route exact path={routes.ERROR_401.url} component={routes.ERROR_401.component} />
          <Route exact path={routes.ERROR_500.url} component={routes.ERROR_500.component} />
          <Route exact path={routes.ERROR_404.url} component={routes.ERROR_404.component} />
          <Route path="*" component={NotFound} />
        </Switch>
      </AuthContextProvider>
    </div>
  );
};

export {
  App
};
