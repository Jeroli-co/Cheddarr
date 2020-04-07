import {useContext} from "react";
import {AuthContext} from "../contexts/AuthContext";
import {Redirect, Route} from "react-router-dom";
import React from "react";
import {routes} from "./routes";

const ProtectedRoute = ({component: Component, location, ...rest}) => {

  const { isAuthenticated, isLoading, hasBeenLoaded } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (isAuthenticated) {
          return <Redirect to={routes.HOME.url}/>;
        } else if (hasBeenLoaded && !isLoading) {
          return <Component {...props} />;
        }
      }
    }/>
  )
};

export {
  ProtectedRoute
}