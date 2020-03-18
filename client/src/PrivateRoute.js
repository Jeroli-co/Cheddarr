import {useContext} from "react";
import {AuthContext} from "./context/AuthContext";
import {Route} from "react-router";
import React from "react";

const PrivateRoute = ({component: Component, ...rest}) => {

  const { isAuthenticated } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (isAuthenticated) {
          return<Component {...props} />
        }
      }
    }/>
  )
};

export {
  PrivateRoute
}