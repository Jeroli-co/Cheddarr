import * as React from "react";
import { Route, Routes, Navigate } from "react-router";
import AuthenticationContextProvider from "../../shared/contexts/AuthenticationContext";
import { PageLoader } from "../../shared/components/PageLoader";

const SignInForm = React.lazy(() => import("../../logged-out-app/SignInForm"));
const SignUpForm = React.lazy(() => import("../../logged-out-app/SignUpForm"));
const ResetPassword = React.lazy(
  () => import("../../logged-out-app/elements/ResetPassword"),
);

export default () => {
  return (
    <AuthenticationContextProvider>
      <React.Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="sign-in/plex/confirm" element={<PageLoader />} />
          <Route path="sign-in" element={<SignInForm />} />
          <Route path="sign-up" element={<SignUpForm />} />
          <Route path="password/:token" element={<ResetPassword />} />
          <Route index element={<Navigate to="sign=in" />} />
        </Routes>
      </React.Suspense>
    </AuthenticationContextProvider>
  );
};
