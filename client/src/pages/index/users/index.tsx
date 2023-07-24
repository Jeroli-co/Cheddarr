import * as React from "react";
import { H1 } from "../../../shared/components/Titles";
import { useRoleGuard } from "../../../shared/hooks/useRoleGuard";
import { Roles } from "../../../shared/enums/Roles";
import { PageLoader } from "../../../shared/components/PageLoader";
import { Navigate, Route, Routes } from "react-router";
import { routes } from "../../../router/routes";
import { TabsContextProvider } from "../../../shared/contexts/TabsContext";

const ConfirmedUsersPage = React.lazy(() => import("./confirmed"));
const PendingUsersPage = React.lazy(() => import("./pending"));

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const tabs = [
    { label: "Confirmed", uri: "confirmed" },
    { label: "Pending", uri: "pending" },
  ];

  useRoleGuard([Roles.MANAGE_USERS]);

  return (
    <>
      <H1>Manage users</H1>
      <TabsContextProvider tabs={tabs} url={routes.USERS.url}>
        <React.Suspense fallback={<PageLoader />}>
          <Routes>
            <Route index element={<Navigate to="./confirmed" />} />
            <Route path="confirmed" element={<ConfirmedUsersPage />} />
            <Route path="pending" element={<PendingUsersPage />} />
          </Routes>
        </React.Suspense>
      </TabsContextProvider>
    </>
  );
};
