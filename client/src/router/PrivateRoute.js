import {useContext} from "react";
import {AuthContext} from "../contexts/AuthContext";
import {Redirect, Route} from "react-router-dom";
import React from "react";
import {routes} from "./routes";

const PrivateRoute = ({component: Component, location, ...rest}) => {

  const { isAuthenticated, isLoading } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (isAuthenticated) {
          return <Component {...props} />
        } else if (!isLoading) {
          return <Redirect to={routes.SIGN_IN.url}/>
        }
      }}
    />
  );

};

export {
  PrivateRoute
}