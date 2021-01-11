import React from "react";
import { useSession } from "../shared/contexts/SessionContext";
import { Route, RouteProps } from "react-router-dom";
import { Redirect } from "react-router";
import { PageLoader } from "../shared/components/PageLoader";
import { routes } from "./routes";

type LoggedOutRouteProps = {
  component: React.ComponentType<RouteProps>;
  rest: any;
};

export const LoggedOutRoute = ({
  component: Component,
  ...rest
}: LoggedOutRouteProps) => {
  const {
    session: { isAuthenticated, isLoading },
  } = useSession();

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!isAuthenticated) {
          return <Component {...props} />;
        } else if (isLoading) {
          return <PageLoader />;
        } else {
          return <Redirect to={routes.HOME.url} />;
        }
      }}
    />
  );
};
