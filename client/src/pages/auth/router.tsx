import * as React from "react";
import { Route, Routes, Navigate } from "react-router";
import AuthenticationContextProvider from "../../shared/contexts/AuthenticationContext";
import { PageLoader } from "../../shared/components/PageLoader";

const SignInPage = React.lazy(() => import("./sign-in"));
const SignUpPage = React.lazy(() => import("./sign-up"));
const ResetPassword = React.lazy(
  () => import("../../components/ResetPassword"),
);

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  return (
    <AuthenticationContextProvider>
      <React.Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="sign-in" element={<SignInPage />} />
          <Route path="sign-in/plex/confirm" element={<PageLoader />} />
          <Route path="sign-up" element={<SignUpPage />} />
          <Route path="password/:token" element={<ResetPassword />} />
          <Route index element={<Navigate to="sign-in" />} />
        </Routes>
      </React.Suspense>
    </AuthenticationContextProvider>
  );
};
