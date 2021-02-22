import React from "react";
import { Route, Switch } from "react-router";
import { routes } from "../../../router/routes";
import { TabsContextProvider } from "../../../shared/contexts/TabsContext";

const Settings = () => {
  return (
    <TabsContextProvider
      tabs={[
        { label: "Connect", uri: "connections" },
        { label: "Media servers", uri: "media-servers" },
        { label: "Radarr", uri: "radarr" },
        { label: "Sonarr", uri: "sonarr" },
        { label: "Notifications", uri: "notifications" },
      ]}
      url={routes.SETTINGS.url}
    >
      <Switch>
        <Route
          exact
          path={routes.SETTINGS_MEDIA_SERVERS.url}
          component={routes.SETTINGS_MEDIA_SERVERS.component}
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
          exact
          path={routes.SETTINGS_NOTIFICATIONS.url}
          component={routes.SETTINGS_NOTIFICATIONS.component}
        />
        <Route
          path={[routes.SETTINGS.url, routes.SETTINGS_CONNECTIONS.url]}
          component={routes.SETTINGS_CONNECTIONS.component}
        />
      </Switch>
    </TabsContextProvider>
  );
};

export { Settings };
