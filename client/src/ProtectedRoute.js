import React, {useContext} from 'react';
import { Route, Redirect } from "react-router-dom";
import {AuthContext} from "./context/AuthContext";

const ProtectedRoute = ({component: Component, ...rest}) => {

  const { isAuthenticated } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (isAuthenticated) {
          return<Component {...props} />
        } else {
          return <Redirect to='/'/>
        }
      }
    }/>
  )
};

export default ProtectedRoute;