import React from 'react';
import {Route, Switch} from "react-router-dom";
import './App.css';
import {Navbar} from "./component/navbar/Navbar";
import AuthContextProvider from "./context/AuthContext";
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import {ProtectedRoute, PrivateRoute, routes} from "./routes";
import {NotFound} from "./component/public/not-found/NotFound";

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
          <ProtectedRoute exaxt path={routes.WAIT_ACCOUNT_CONFIRMATION.url(':email')} component={routes.WAIT_ACCOUNT_CONFIRMATION} />
          <ProtectedRoute exact path={routes.RESET_PASSWORD.url(':token')} component={routes.RESET_PASSWORD.component} />
          <ProtectedRoute path={routes.AUTHORIZE_GOOGLE.url} component={routes.AUTHORIZE_GOOGLE.component} />
          <ProtectedRoute path={routes.AUTHORIZE_FACEBOOK.url} component={routes.AUTHORIZE_FACEBOOK.component} />

          <PrivateRoute exact path={routes.USER_PROFILE.url} component={routes.USER_PROFILE.component} />

          <Route path="*" component={NotFound} />
        </Switch>
      </AuthContextProvider>
    </div>
  );
};

export default App;
