import React, { Suspense } from "react";
import { useSession } from "./shared/contexts/SessionContext";
import { PageLoader } from "./shared/components/PageLoader";
import { LoggedInApp } from "./logged-in-app/LoggedInApp";

const AuthenticationContextProvider = React.lazy(() =>
  import("./logged-out-app/contexts/AuthenticationContext")
);
const PlexConfigContextProvider = React.lazy(() =>
  import("./logged-in-app/contexts/PlexConfigContext")
);
const SwitchRoutes = React.lazy(() => import("./router/SwitchRoutes"));

export const DynamicApp = () => {
  const {
    session: { isAuthenticated },
  } = useSession();

  return isAuthenticated ? (
    <Suspense fallback={<PageLoader />}>
      <PlexConfigContextProvider>
        <LoggedInApp />
      </PlexConfigContextProvider>
    </Suspense>
  ) : (
    <Suspense fallback={<PageLoader />}>
      <AuthenticationContextProvider>
        <SwitchRoutes />
      </AuthenticationContextProvider>
    </Suspense>
  );
};
