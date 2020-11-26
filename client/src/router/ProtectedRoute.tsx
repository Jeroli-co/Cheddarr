import React from "react";
import { Redirect, Route } from "react-router-dom";
import { routes } from "./routes";

const ProtectedRoute = ({ component, isAuthenticated, ...rest }: any) => {
  const routeComponent = (props: any) =>
    !isAuthenticated ? (
      React.createElement(component, props)
    ) : (
      <Redirect to={routes.HOME.url} />
    );
  return <Route {...rest} render={routeComponent} />;
};

export { ProtectedRoute };
