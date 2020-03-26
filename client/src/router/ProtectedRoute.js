import {useContext} from "react";
import {AuthContext} from "../contexts/AuthContext";
import {Route} from "react-router";
import React from "react";

const ProtectedRoute = ({component: Component, ...rest}) => {

  const { isAuthenticated } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!isAuthenticated) {
          return <Component {...props} />;
        } else {
          return <div/>;
        }
      }
    }/>
  )
};

export {
  ProtectedRoute
}