import * as React from "react";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router";
import { routes } from "../../router/routes";
import { Tab, TabsContextProvider } from "../../shared/contexts/TabsContext";
import { RequestsContextProvider } from "../../shared/contexts/RequestsContext";
import { useRoleGuard } from "../../shared/hooks/useRoleGuard";
import { Roles } from "../../shared/enums/Roles";
import { checkRole } from "../../utils/roles";
import { useSession } from "../../shared/contexts/SessionContext";
import { PageLoader } from "../../shared/components/PageLoader";

const RequestsSentPage = React.lazy(
  () => import("../../shared/components/requests/RequestsSent"),
);
const RequestsReceivedPage = React.lazy(
  () => import("../../shared/components/requests/RequestsReceived"),
);

const Requests = () => {
  const {
    session: { user },
  } = useSession();

  useRoleGuard([Roles.REQUEST, Roles.MANAGE_REQUEST], true);

  const [tabs, setTabs] = useState<Tab[]>([]);
  const [hasRequestRole, setHasRequestRole] = useState(false);
  const [hasManageRequestRole, setHasManageRequestRole] = useState(false);

  useEffect(() => {
    let tabsTmp: Tab[] = [];

    if (user && checkRole(user.roles, [Roles.MANAGE_REQUEST])) {
      tabsTmp = [{ label: "Received", uri: "incoming" }];
      setHasManageRequestRole(true);
    }

    if (user && checkRole(user.roles, [Roles.REQUEST])) {
      tabsTmp = [...tabsTmp, { label: "Sent", uri: "outgoing" }];
      setHasRequestRole(true);
    }

    setTabs(tabsTmp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <TabsContextProvider tabs={tabs} url={routes.REQUESTS.url}>
      <RequestsContextProvider>
        <React.Suspense fallback={<PageLoader />}>
          <Routes>
            {hasManageRequestRole && (
              <Route
                path={routes.REQUESTS_RECEIVED.url}
                element={<RequestsReceivedPage />}
              />
            )}
            {hasRequestRole && (
              <Route
                path={routes.REQUESTS_SENT.url}
                element={<RequestsSentPage />}
              />
            )}
          </Routes>
        </React.Suspense>
      </RequestsContextProvider>
    </TabsContextProvider>
  );
};

export { Requests };

export default Requests;
