import React from "react";
import { Route, Switch } from "react-router-dom";
import { routes } from "../routes";

export const SwitchRoutes = (props: any) => {
  return (
    <Switch>
      <Route
        exact
        path={routes.HOME.url}
        component={routes.HOME.loggedOutComponent}
      />
      <Route
        path={routes.SIGN_IN.url()}
        component={routes.SIGN_IN.component}
        {...props}
      />
      <Route
        exact
        path={routes.SIGN_UP.url}
        component={routes.SIGN_UP.component}
        {...props}
      />
      <Route
        exact
        path={routes.CONFIRM_EMAIL.url(":token")}
        component={routes.CONFIRM_EMAIL.component}
        {...props}
      />
      <Route
        exact
        path={routes.RESET_PASSWORD.url(":token")}
        component={routes.RESET_PASSWORD.component}
        {...props}
      />
      <Route component={routes.NOT_FOUND.component} />
    </Switch>
  );
};
