import React from "react";
import { Route, Switch } from "react-router-dom";
import { routes } from "./routes";
import { LoggedOutRoute } from "./LoggedOutRoute";
import { LoggedInRoute } from "./LoggedInRoute";

export default function SwitchRoutes(props: any) {
  return (
    <Switch>
      <Route exact path={routes.HOME.url} component={routes.HOME.component} />
      <LoggedOutRoute
        exact
        path={routes.CONFIRM_EMAIL.url(":token")}
        component={routes.CONFIRM_EMAIL.component}
        {...props}
      />
      <LoggedOutRoute
        exact
        path={routes.RESET_PASSWORD.url(":token")}
        component={routes.RESET_PASSWORD.component}
        {...props}
      />
      <LoggedOutRoute
        exact
        path={routes.SIGN_UP.url}
        component={routes.SIGN_UP.component}
        {...props}
      />
      <LoggedOutRoute
        path={routes.SIGN_IN.url()}
        component={routes.SIGN_IN.component}
        {...props}
      />
      <LoggedInRoute
        path={routes.PROFILE.url}
        component={routes.PROFILE.component}
        {...props}
      />
      <LoggedInRoute
        exact
        path={routes.PUBLIC_USER.url(":username")}
        component={routes.PUBLIC_USER.component}
        {...props}
      />
      <LoggedInRoute
        path={routes.SETTINGS.url}
        component={routes.SETTINGS.component}
        {...props}
      />
      <LoggedInRoute
        exact
        path={routes.MOVIE.url(":id")}
        component={routes.MOVIE.component}
        {...props}
      />
      <LoggedInRoute
        exact
        path={routes.SERIES.url(":id")}
        component={routes.SERIES.component}
        {...props}
      />
      <LoggedInRoute
        exact
        path={routes.SEASON.url(":id", ":seasonNumber")}
        component={routes.SERIES.component}
        {...props}
      />
      <LoggedInRoute
        exact
        path={routes.EPISODE.url(":id", ":seasonNumber", ":episodeNumber")}
        component={routes.EPISODE.component}
        {...props}
      />
      <LoggedInRoute
        exact
        path={routes.SEARCH.url(":type", ":title")}
        component={routes.SEARCH.component}
        {...props}
      />
      <LoggedInRoute
        path={routes.REQUESTS.url}
        component={routes.REQUESTS.component}
        {...props}
      />

      <Route component={routes.NOT_FOUND.component} />
    </Switch>
  );
}
