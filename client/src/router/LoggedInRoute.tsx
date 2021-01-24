import { Redirect, Route, RouteProps } from "react-router-dom";
import React from "react";
import { useSession } from "../shared/contexts/SessionContext";
import { PageLoader } from "../shared/components/PageLoader";
import { routes } from "./routes";

type LoggedInRouteProps = {
  component: React.ComponentType<RouteProps>;
  rest: any;
};

export const LoggedInRoute = ({
  component: Component,
  ...rest
}: LoggedInRouteProps) => {
  const {
    session: { isAuthenticated, isLoading },
  } = useSession();

  return (
    <Route
      {...rest}
      render={(props) => {
        if (isAuthenticated) {
          return <Component {...props} />;
        } else if (isLoading) {
          return <PageLoader />;
        } else {
          return <Redirect to={routes.SIGN_IN.url()} />;
        }
      }}
    />
  );
};
