import React, { Suspense } from "react";
import { useSession } from "./shared/contexts/SessionContext";
import { PageLoader } from "./shared/components/PageLoader";

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
          <SwitchRoutes />
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
