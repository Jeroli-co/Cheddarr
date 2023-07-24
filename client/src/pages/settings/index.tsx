import * as React from "react";
import { Navigate, Route, Routes } from "react-router";
import { routes } from "../../routes";
import { TabsContextProvider } from "../../shared/contexts/TabsContext";
import { SonarrConfigsContextProvider } from "../../shared/contexts/SonarrConfigContext";
import { RadarrConfigsContextProvider } from "../../shared/contexts/RadarrConfigsContext";
import { NotificationsServicesContextProvider } from "../../shared/contexts/NotificationsServicesContext";
import { useRoleGuard } from "../../shared/hooks/useRoleGuard";
import { Roles } from "../../shared/enums/Roles";
import { useSession } from "../../shared/contexts/SessionContext";
import { checkRole } from "../../utils/roles";
import { useEffect, useState } from "react";
import { PageLoader } from "../../shared/components/PageLoader";

const MediaServersPage = React.lazy(() => import("./media-servers"));
const MediaProvidersPage = React.lazy(() => import("./media-providers"));
const NotificationsServicesPage = React.lazy(
  () => import("./notifications-services"),
);
const JobsPage = React.lazy(() => import("./jobs"));
const GeneralPage = React.lazy(() => import("./general"));
const Logs = React.lazy(() => import("./logs"));

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
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
        { label: "Notifications", uri: "notifications-services" },
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
                <Route index element={<Navigate to="./media-servers" />} />
                <Route path="media-servers" element={<MediaServersPage />} />
                <Route
                  path="media-providers"
                  element={<MediaProvidersPage />}
                />
                {user && checkRole(user.roles, [Roles.ADMIN]) && (
                  <Route
                    path="notifications-services"
                    element={<NotificationsServicesPage />}
                  />
                )}
                {user && checkRole(user.roles, [Roles.ADMIN]) && (
                  <Route path="jobs" element={<JobsPage />} />
                )}
                {user && checkRole(user.roles, [Roles.ADMIN]) && (
                  <Route path="general" element={<GeneralPage />} />
                )}
                {user && checkRole(user.roles, [Roles.ADMIN]) && (
                  <Route path="logs" element={<Logs />} />
                )}
              </Routes>
            </React.Suspense>
          </NotificationsServicesContextProvider>
        </RadarrConfigsContextProvider>
      </SonarrConfigsContextProvider>
    </TabsContextProvider>
  );
};
