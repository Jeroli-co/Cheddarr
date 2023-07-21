import * as React from "react";
import { useSession } from "../../shared/contexts/SessionContext";
import { PageLoader } from "../../shared/components/PageLoader";
import { Routes, Route, useLocation, Navigate } from "react-router";
import { routes } from "../routes";

const RedirectToSignIn = () => {
  const location = useLocation();

  return <Navigate to={routes.SIGN_IN.url(location.pathname)} />;
};

const AuthRouter = React.lazy(() => import("./AuthRouter"));
const LoggedInApp = React.lazy(() => import("../../logged-in-app/LoggedInApp"));

export const MainRouter = () => {
  const {
    session: { isAuthenticated },
  } = useSession();

  return (
    <React.Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="auth/*" element={<AuthRouter />} />
        <Route
          index
          path="*"
          element={isAuthenticated ? <LoggedInApp /> : <RedirectToSignIn />}
        />
      </Routes>
    </React.Suspense>
  );
};