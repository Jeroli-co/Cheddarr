import {useContext} from "react";
import {AuthContext} from "../contexts/AuthContext";
import {Redirect, Route} from "react-router-dom";
import React from "react";
import {routes} from "./routes";
import {PageLoader} from "../elements/PageLoader";

const ProtectedRoute = ({component: Component, location, ...rest}) => {

  const { isAuthenticated, isLoading } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (isAuthenticated) {
          return <Redirect to={routes.HOME.url}/>;
        } else if (isLoading) {
          return <PageLoader/>;
        } else {
          return <Component {...props} />;
        }
      }
    }/>
  )
};

export {
  ProtectedRoute
}
