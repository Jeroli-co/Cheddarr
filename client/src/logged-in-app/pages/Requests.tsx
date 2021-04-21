import React from "react";
import { Route, Switch } from "react-router";
import { routes } from "../../router/routes";
import { TabsContextProvider } from "../../shared/contexts/TabsContext";
import { RequestsContextProvider } from "../../shared/contexts/RequestsContext";
import { useRoleGuard } from "../../shared/hooks/useRoleGuard";
import { Roles } from "../../shared/enums/Roles";

const Requests = () => {
  useRoleGuard([Roles.REQUEST]);

  return (
    <TabsContextProvider
      tabs={[
        { label: "Sent", uri: "outgoing" },
        { label: "Received", uri: "incoming" },
      ]}
      url={routes.REQUESTS.url}
    >
      <RequestsContextProvider>
        <Switch>
          <Route
            exact
            path={routes.REQUESTS_RECEIVED.url}
            component={routes.REQUESTS_RECEIVED.component}
          />
          <Route
            path={[routes.REQUESTS.url, routes.REQUESTS_SENT.url]}
            component={routes.REQUESTS_SENT.component}
          />
        </Switch>
      </RequestsContextProvider>
    </TabsContextProvider>
  );
};

export { Requests };
