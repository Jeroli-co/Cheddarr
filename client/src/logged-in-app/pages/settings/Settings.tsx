import React from "react";
import { Route, Switch } from "react-router";
import { routes } from "../../../router/routes";
import { TabsContextProvider } from "../../../shared/contexts/TabsContext";
import { SonarrConfigsContextProvider } from "../../../shared/contexts/SonarrConfigContext";
import { RadarrConfigsContextProvider } from "../../../shared/contexts/RadarrConfigsContext";
import { NotificationsServicesContextProvider } from "../../../shared/contexts/NotificationsServicesContext";

export const Settings = () => {
  return (
    <TabsContextProvider
      tabs={[
        { label: "Media servers", uri: "media-servers" },
        { label: "Media providers", uri: "media-providers" },
        { label: "Notifications", uri: "notifications" },
        { label: "Jobs", uri: "jobs" },
      ]}
      url={routes.SETTINGS.url}
    >
      <SonarrConfigsContextProvider>
        <RadarrConfigsContextProvider>
          <NotificationsServicesContextProvider>
            <Switch>
              <Route
                exact
                path={routes.SETTINGS_MEDIA_SERVERS.url}
                component={routes.SETTINGS_MEDIA_SERVERS.component}
              />
              <Route
                exact
                path={routes.SETTINGS_MEDIA_PROVIDERS.url}
                component={routes.SETTINGS_MEDIA_PROVIDERS.component}
              />
              <Route
                exact
                path={routes.SETTINGS_NOTIFICATIONS.url}
                component={routes.SETTINGS_NOTIFICATIONS.component}
              />
              <Route
                exact
                path={routes.SETTINGS_JOBS.url}
                component={routes.SETTINGS_JOBS.component}
              />
              <Route
                path={routes.SETTINGS.url}
                component={routes.SETTINGS_MEDIA_SERVERS.component}
              />
            </Switch>
          </NotificationsServicesContextProvider>
        </RadarrConfigsContextProvider>
      </SonarrConfigsContextProvider>
    </TabsContextProvider>
  );
};
