import * as React from "react";
import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router";
import { routes } from "../../../router/routes";
import { Tab, TabsContextProvider } from "../../../shared/contexts/TabsContext";
import { RequestsContextProvider } from "../../../shared/contexts/RequestsContext";
import { useRoleGuard } from "../../../shared/hooks/useRoleGuard";
import { Roles } from "../../../shared/enums/Roles";
import { checkRole } from "../../../utils/roles";
import { useSession } from "../../../shared/contexts/SessionContext";
import { PageLoader } from "../../../shared/components/PageLoader";

const SentPage = React.lazy(() => import("./sent"));
const ReceivedPage = React.lazy(() => import("./received"));

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const {
    session: { user },
  } = useSession();

  useRoleGuard([Roles.REQUEST, Roles.MANAGE_REQUEST], true);

  const [tabs, setTabs] = useState<Tab[]>([]);

  useEffect(() => {
    let tabsTmp: Tab[] = [];

    if (user && checkRole(user.roles, [Roles.MANAGE_REQUEST])) {
      tabsTmp = [{ label: "Received", uri: "received" }];
    }

    if (user && checkRole(user.roles, [Roles.REQUEST])) {
      tabsTmp = [...tabsTmp, { label: "Sent", uri: "sent" }];
    }

    setTabs(tabsTmp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <TabsContextProvider tabs={tabs} url={routes.REQUESTS.url}>
      <RequestsContextProvider>
        <React.Suspense fallback={<PageLoader />}>
          <Routes>
            <Route index element={<Navigate to="./received" />} />
            {user && checkRole(user.roles, [Roles.MANAGE_REQUEST]) && (
              <Route path="received" element={<ReceivedPage />} />
            )}
            {user && checkRole(user.roles, [Roles.REQUEST]) && (
              <Route path="sent" element={<SentPage />} />
            )}
          </Routes>
        </React.Suspense>
      </RequestsContextProvider>
    </TabsContextProvider>
  );
};
