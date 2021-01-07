import React from "react";
import { Route, Switch } from "react-router-dom";
import { routes } from "../routes";

export const SwitchRoutes = (props: any) => {
  return (
    <Switch>
      <Route
        exact
        path={routes.HOME.url}
        component={routes.HOME.loggedInComponent}
      />
      <Route
        path={routes.USER_PROFILE.url}
        component={routes.USER_PROFILE.component}
        {...props}
      />
      <Route
        exact
        path={routes.PUBLIC_USER.url(":username")}
        component={routes.PUBLIC_USER.component}
        {...props}
      />
      <Route
        path={routes.SETTINGS.url}
        component={routes.SETTINGS.component}
        {...props}
      />
      <Route
        exact
        path={routes.MOVIE.url(":id")}
        component={routes.MOVIE.component}
        {...props}
      />
      <Route
        exact
        path={routes.SERIES.url(":id")}
        component={routes.SERIES.component}
        {...props}
      />
      <Route
        exact
        path={routes.SEASON.url(":id")}
        component={routes.SEASON.component}
        {...props}
      />
      <Route
        exact
        path={routes.SEARCH.url(":type", ":title")}
        component={routes.SEARCH.component}
        {...props}
      />
      <Route
        path={routes.REQUESTS.url}
        component={routes.REQUESTS.component}
        {...props}
      />
      <Route component={routes.NOT_FOUND.component} />
    </Switch>
  );
};
