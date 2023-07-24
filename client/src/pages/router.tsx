import * as React from "react";
import { PageLoader } from "../shared/components/PageLoader";
import { Routes, Route } from "react-router";

const AuthRouter = React.lazy(() => import("./auth/router"));
const IndexRouter = React.lazy(() => import("./index"));

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  return (
    <React.Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="auth/*" element={<AuthRouter />} />
        <Route index path="*" element={<IndexRouter />} />
      </Routes>
    </React.Suspense>
  );
};
