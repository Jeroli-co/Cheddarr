import React, { useContext } from "react";
import { Redirect, Route } from "react-router-dom";
import { routes } from "./routes";
import { AuthContext } from "../contexts/auth/AuthContext";

const PrivateRoute = ({ component, ...rest }: any) => {
  const {
    session: { isAuthenticated, isLoading },
  } = useContext(AuthContext);

  const routeComponent = (props: any) => {
    if (isLoading) {
      return <div />;
    } else if (isAuthenticated) {
      return React.createElement(component, props);
    } else {
      return <Redirect to={{ pathname: routes.SIGN_IN.url }} />;
    }
  };

  return <Route {...rest} render={routeComponent} />;
};

export { PrivateRoute };
