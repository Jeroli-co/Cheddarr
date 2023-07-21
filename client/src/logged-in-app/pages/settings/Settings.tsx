import * as React from "react";
import { Navigate, Route, Routes } from "react-router";
import { routes } from "../../../router/routes";
import { TabsContextProvider } from "../../../shared/contexts/TabsContext";
import { SonarrConfigsContextProvider } from "../../../shared/contexts/SonarrConfigContext";
import { RadarrConfigsContextProvider } from "../../../shared/contexts/RadarrConfigsContext";
import { NotificationsServicesContextProvider } from "../../../shared/contexts/NotificationsServicesContext";
import { useRoleGuard } from "../../../shared/hooks/useRoleGuard";
import { Roles } from "../../../shared/enums/Roles";
import { useSession } from "../../../shared/contexts/SessionContext";
import { checkRole } from "../../../utils/roles";
import { useEffect, useState } from "react";
import { PageLoader } from "../../../shared/components/PageLoader";

const MediaServersSettingsPage = React.lazy(
  () => import("../settings/media-servers/MediaServersSettings"),
);
const MediaProvidersSettingsPage = React.lazy(
  () => import("../settings/media-providers/MediaProvidersSettings"),
);
const NotificationsServicesSettingsPage = React.lazy(
  () => import("../settings/notifications/NotificationsServicesSettings"),
);
const JobsSettingsPage = React.lazy(
  () => import("../settings/jobs/JobsSettings"),
);
const GeneralSettingsPage = React.lazy(
  () => import("../settings/general/GeneralSettings"),
);
const ServerLogsPage = React.lazy(
  () => import("../settings/server-logs/ServerLogs"),
);

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
            <React.Suspense fallback={<PageLoader />}>
              <Routes>
                <Route
                  path={routes.SETTINGS_MEDIA_PROVIDERS.url}
                  element={<MediaProvidersSettingsPage />}
                />
                {user && checkRole(user.roles, [Roles.ADMIN]) && (
                  <Route
                    path={routes.SETTINGS_NOTIFICATIONS.url}
                    element={<NotificationsServicesSettingsPage />}
                  />
                )}
                {user && checkRole(user.roles, [Roles.ADMIN]) && (
                  <Route
                    path={routes.SETTINGS_JOBS.url}
                    element={<JobsSettingsPage />}
                  />
                )}
                {user && checkRole(user.roles, [Roles.ADMIN]) && (
                  <Route
                    path={routes.SETTINGS_GENERAL.url}
                    element={<GeneralSettingsPage />}
                  />
                )}
                {user && checkRole(user.roles, [Roles.ADMIN]) && (
                  <Route
                    path={routes.SETTINGS_SERVER_LOGS.url}
                    element={<ServerLogsPage />}
                  />
                )}
                <Route
                  path={routes.SETTINGS_MEDIA_SERVERS.url}
                  element={<Navigate to={routes.SETTINGS.url} />}
                />
                <Route
                  index
                  path={routes.SETTINGS.url}
                  element={<MediaServersSettingsPage />}
                />
              </Routes>
            </React.Suspense>
          </NotificationsServicesContextProvider>
        </RadarrConfigsContextProvider>
      </SonarrConfigsContextProvider>
    </TabsContextProvider>
  );
};

export default Settings;
