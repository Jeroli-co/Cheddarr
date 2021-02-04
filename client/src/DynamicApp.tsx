import React, { Suspense } from "react";
import { useSession } from "./shared/contexts/SessionContext";
import { PageLoader } from "./shared/components/PageLoader";
import styled from "styled-components";
import { SidebarMenu } from "./shared/components/layout/SidebarMenu";

const AuthenticationContextProvider = React.lazy(() =>
  import("./logged-out-app/contexts/AuthenticationContext")
);
const LoggedOutNavbar = React.lazy(() =>
  import("./logged-out-app/LoggedOutNavbar")
);
const LoggedInNavbar = React.lazy(() =>
  import("./logged-in-app/navbar/LoggedInNavbar")
);
const PlexConfigContextProvider = React.lazy(() =>
  import("./logged-in-app/contexts/PlexConfigContext")
);
const SwitchRoutes = React.lazy(() => import("./router/SwitchRoutes"));

const LoggedInLayout = styled.section`
  display: flex;
`;

export const DynamicApp = () => {
  const {
    session: { isAuthenticated },
  } = useSession();

  // TODO: Move signinwithplex then remove authcontext from authenticated app

  return isAuthenticated ? (
    <Suspense fallback={<PageLoader />}>
      <AuthenticationContextProvider>
        <PlexConfigContextProvider>
          <LoggedInNavbar />
          <LoggedInLayout>
            <SidebarMenu />
            <SwitchRoutes />
          </LoggedInLayout>
        </PlexConfigContextProvider>
      </AuthenticationContextProvider>
    </Suspense>
  ) : (
    <Suspense fallback={<PageLoader />}>
      <AuthenticationContextProvider>
        <LoggedOutNavbar />
        <SwitchRoutes />
      </AuthenticationContextProvider>
    </Suspense>
  );
};
