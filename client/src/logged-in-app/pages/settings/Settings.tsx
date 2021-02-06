import React from "react";
import { Route, Switch } from "react-router";
import { routes } from "../../../router/routes";
import { TabsContextProvider } from "../../../shared/contexts/TabsContext";

const Settings = () => {
  return (
    <TabsContextProvider
      tabs={["Account", "Plex", "Radarr", "Sonarr"]}
      url={routes.SETTINGS.url}
    >
      <Switch>
        <Route
          exact
          path={routes.SETTINGS_PLEX.url}
          component={routes.SETTINGS_PLEX.component}
        />
        <Route
          exact
          path={routes.SETTINGS_RADARR.url}
          component={routes.SETTINGS_RADARR.component}
        />
        <Route
          exact
          path={routes.SETTINGS_SONARR.url}
          component={routes.SETTINGS_SONARR.component}
        />
        <Route
          path={[routes.SETTINGS.url, routes.SETTINGS_ACCOUNT.url]}
          component={routes.SETTINGS_ACCOUNT.component}
        />
      </Switch>
    </TabsContextProvider>
  );
};

export { Settings };
