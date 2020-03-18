import {useContext} from "react";
import {AuthContext} from "./context/AuthContext";
import {Redirect, Route} from "react-router";
import React from "react";
import {routes} from "./routes";

const ProtectedRoute = ({component: Component, ...rest}) => {

  const { isAuthenticated } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!isAuthenticated) {
          return <Component {...props} />
        } else {
          return <Redirect to={routes.HOME.url} />
        }
      }
    }/>
  )
};

export {
  ProtectedRoute
}