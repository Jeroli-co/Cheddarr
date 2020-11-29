import React, { useContext } from "react";
import { Redirect, Route } from "react-router-dom";
import { routes } from "./routes";
import { AuthContext } from "../contexts/auth/AuthContext";

const ProtectedRoute = ({ component, ...rest }: any) => {
  const {
    session: { isAuthenticated, isLoading },
  } = useContext(AuthContext);

  const routeComponent = (props: any) => {
    if (isLoading) {
      return <div />;
    } else if (!isAuthenticated) {
      return React.createElement(component, props);
    } else {
      return <Redirect to={routes.HOME.url} />;
    }
  };

  return <Route {...rest} render={routeComponent} />;
};

export { ProtectedRoute };
