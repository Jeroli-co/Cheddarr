import {useContext} from "react";
import {AuthContext} from "./context/AuthContext";
import {Redirect, Route} from "react-router";
import React from "react";
import {routes} from "./routes";

const PrivateRoute = ({component: Component, ...rest}) => {

  const { isAuthenticated } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (isAuthenticated) {
          return<Component {...props} />
        } else {
          return <Redirect to={routes.SIGN_IN.url} />
        }
      }
    }/>
  )
};

export {
  PrivateRoute
}