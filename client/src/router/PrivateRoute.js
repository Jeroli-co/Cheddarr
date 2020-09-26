import { useContext } from "react";
import { AuthContext } from "../modules/auth/contexts/AuthContext";
import { Redirect, Route } from "react-router-dom";
import React from "react";
import { routes } from "./routes";
import { PageLoader } from "../utils/elements/PageLoader";

const PrivateRoute = ({ component: Component, location, ...rest }) => {
  const { isAuthenticated, isLoading } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (isLoading) {
          return <PageLoader />;
        } else if (isAuthenticated) {
          return <Component {...props} />;
        } else {
          return <Redirect to={routes.SIGN_IN.url} />;
        }
      }}
    />
  );
};

export { PrivateRoute };
