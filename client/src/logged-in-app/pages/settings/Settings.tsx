import React, { useEffect, useState } from "react";
import { Route, Switch } from "react-router";
import { routes } from "../../../router/routes";
import { TabsContextProvider } from "../../../shared/contexts/TabsContext";
import { SonarrConfigsContextProvider } from "../../../shared/contexts/SonarrConfigContext";
import { RadarrConfigsContextProvider } from "../../../shared/contexts/RadarrConfigsContext";
import { NotificationsServicesContextProvider } from "../../../shared/contexts/NotificationsServicesContext";
import { useRoleGuard } from "../../../shared/hooks/useRoleGuard";
import { Roles } from "../../../shared/enums/Roles";
import { useSession } from "../../../shared/contexts/SessionContext";
import { checkRole } from "../../../utils/roles";

export const Settings = () => {
  const {
    session: { user },
  } = useSession();

  useRoleGuard([Roles.MANAGE_SETTINGS]);

  const [tabs, setTabs] = useState([
    { label: "Media servers", uri: "media-servers" },
    { label: "Media providers", uri: "media-providers" },
  ]);

  useEffect(() => {
    if (user && checkRole(user.roles, [Roles.ADMIN])) {
      setTabs([
        ...tabs,
        { label: "Notifications", uri: "notifications" },
        { label: "Jobs", uri: "jobs" },
        { label: "General", uri: "general" },
        { label: "Logs", uri: "logs" },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <TabsContextProvider tabs={tabs} url={routes.SETTINGS.url}>
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
              {user && checkRole(user.roles, [Roles.ADMIN]) && (
                <Route
                  exact
                  path={routes.SETTINGS_NOTIFICATIONS.url}
                  component={routes.SETTINGS_NOTIFICATIONS.component}
                />
              )}
              {user && checkRole(user.roles, [Roles.ADMIN]) && (
                <Route
                  exact
                  path={routes.SETTINGS_JOBS.url}
                  component={routes.SETTINGS_JOBS.component}
                />
              )}
              {user && checkRole(user.roles, [Roles.ADMIN]) && (
                <Route
                  path={routes.SETTINGS_GENERAL.url}
                  component={routes.SETTINGS_GENERAL.component}
                />
              )}
              {user && checkRole(user.roles, [Roles.ADMIN]) && (
                <Route
                  path={routes.SETTINGS_SERVER_LOGS.url}
                  component={routes.SETTINGS_SERVER_LOGS.component}
                />
              )}
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
