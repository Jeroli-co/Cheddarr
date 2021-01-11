import React, { Suspense } from "react";
import { useSession } from "./shared/contexts/SessionContext";
import { PageLoader } from "./shared/components/PageLoader";

const LoggedInApp = React.lazy(() => import("./logged-in-app/LoggedInApp"));
const LoggedOutApp = React.lazy(() => import("./logged-out-app/LoggedOutApp"));

export const DynamicApp = () => {
  const {
    session: { isAuthenticated },
  } = useSession();

  return isAuthenticated ? (
    <Suspense fallback={<PageLoader />}>
      <LoggedInApp />
    </Suspense>
  ) : (
    <Suspense fallback={<PageLoader />}>
      <LoggedOutApp />
    </Suspense>
  );
};
