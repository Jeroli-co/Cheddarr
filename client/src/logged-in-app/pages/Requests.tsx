import React, { useEffect, useState } from "react";
import { Route, Switch } from "react-router";
import { routes } from "../../router/routes";
import { Tab, TabsContextProvider } from "../../shared/contexts/TabsContext";
import { RequestsContextProvider } from "../../shared/contexts/RequestsContext";
import { useRoleGuard } from "../../shared/hooks/useRoleGuard";
import { Roles } from "../../shared/enums/Roles";
import { checkRole } from "../../utils/roles";
import { useSession } from "../../shared/contexts/SessionContext";

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
        <Switch>
          {hasManageRequestRole && (
            <Route
              exact
              path={
                !hasRequestRole
                  ? [routes.REQUESTS.url, routes.REQUESTS_RECEIVED.url]
                  : routes.REQUESTS_RECEIVED.url
              }
              component={routes.REQUESTS_RECEIVED.component}
            />
          )}
          {hasRequestRole && (
            <Route
              path={[routes.REQUESTS.url, routes.REQUESTS_SENT.url]}
              component={routes.REQUESTS_SENT.component}
            />
          )}
        </Switch>
      </RequestsContextProvider>
    </TabsContextProvider>
  );
};

export { Requests };
