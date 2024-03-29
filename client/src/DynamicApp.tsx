import React, { Suspense } from "react";
import { useSession } from "./shared/contexts/SessionContext";
import { PageLoader } from "./shared/components/PageLoader";
import { LoggedInApp } from "./logged-in-app/LoggedInApp";

const AuthenticationContextProvider = React.lazy(() =>
  import("./shared/contexts/AuthenticationContext")
);
const PlexConfigContextProvider = React.lazy(() =>
  import("./shared/contexts/PlexConfigContext")
);
const SwitchRoutes = React.lazy(() => import("./router/SwitchRoutes"));

export const DynamicApp = () => {
  const {
    session: { isAuthenticated, isLoading },
  } = useSession();

  if (isLoading) {
    return <PageLoader />;
  }

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
