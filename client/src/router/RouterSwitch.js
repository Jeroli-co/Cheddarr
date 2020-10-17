import React from "react";
import { Route, Switch } from "react-router-dom";
import { routes } from "./routes";
import { ProtectedRoute } from "./ProtectedRoute";
import { PrivateRoute } from "./PrivateRoute";

const RouterSwitch = () => {
  return (
    <Switch>
      <Route exact path={routes.HOME.url} component={routes.HOME.component} />
      <Route
        exact
        path={routes.CONFIRM_EMAIL.url(":token")}
        component={routes.CONFIRM_EMAIL.component}
      />
      <Route
        exact
        path={routes.RESET_PASSWORD.url(":token")}
        component={routes.RESET_PASSWORD.component}
      />
      <Route
        exact
        path={routes.CONFIRM_PLEX_SIGNIN.url}
        component={routes.CONFIRM_PLEX_SIGNIN.component}
      />
      <ProtectedRoute
        path={routes.SIGN_IN.url}
        component={routes.SIGN_IN.component}
      />
      <ProtectedRoute
        exact
        path={routes.SIGN_UP.url}
        component={routes.SIGN_UP.component}
      />
      <ProtectedRoute
        exact
        path={routes.RESEND_EMAIL_CONFIRMATION.url}
        component={routes.RESEND_EMAIL_CONFIRMATION.component}
      />
      <PrivateRoute
        path={routes.USER_PROFILE.url}
        component={routes.USER_PROFILE.component}
      />
      <PrivateRoute
        exact
        path={routes.USER_FRIEND_PROFILE.url(":id")}
        component={routes.USER_FRIEND_PROFILE.component}
      />
      <PrivateRoute
        path={routes.USER_SETTINGS.url}
        component={routes.USER_SETTINGS.component}
      />
      <PrivateRoute
        exact
        path={routes.MOVIE.url(":id")}
        component={routes.MOVIE.component}
      />
      <PrivateRoute
        exact
        path={routes.SERIES.url(":id")}
        component={routes.SERIES.component}
      />
      <PrivateRoute
        exact
        path={routes.SEASON.url(":seriesId", ":seasonId")}
        component={routes.SEASON.component}
      />
      <PrivateRoute
        exact
        path={routes.SEARCH.url(":type", ":title")}
        component={routes.SEARCH.component}
      />
      <PrivateRoute
        path={routes.REQUESTS.url}
        component={routes.REQUESTS.component}
      />
      <Route component={routes.NOT_FOUND.component} />
    </Switch>
  );
};

export { RouterSwitch };
