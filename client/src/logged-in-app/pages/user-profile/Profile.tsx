import React from "react";
import { Route } from "react-router-dom";
import { routes } from "../../../router/routes";
import { TabsContextProvider } from "../../../shared/contexts/TabsContext";
import { Switch } from "react-router";

export const Profile = () => {
  return (
    <TabsContextProvider tabs={["Profile", "Friends"]} url={routes.PROFILE.url}>
      <Switch>
        <Route
          exact
          path={routes.USER_FRIENDS.url}
          component={routes.USER_FRIENDS.component}
        />
        <Route
          path={[routes.PROFILE.url, routes.USER_PROFILE.url]}
          component={routes.USER_PROFILE.component}
        />
      </Switch>
    </TabsContextProvider>
  );
};
