import {useContext, useEffect, useState} from "react";
import {AuthContext} from "./context/AuthContext";
import {Redirect, Route} from "react-router";
import React from "react";
import {routes} from "./routes";

const PrivateRoute = ({component: Component, location, ...rest}) => {

  const { isAuthenticated, signIn } = useContext(AuthContext);
  const [status, setStatus] = useState(null);
  const [redirect, setRedirect] = useState(null);

  useEffect(() => {

    if (isAuthenticated && status === null) {
      signIn(null, [401]).then((code) => {
        setRedirect(location.pathname);
        setStatus(code);
      });
    }

  }, [isAuthenticated]);

  if (status === null)
    return <div/>;

  if (status === 401)
    return <Redirect to={routes.CONFIRM_PASSWORD.url + '?redirect=' + redirect}/>;

  if (status === 200)
    return <Route {...rest} render={(props) => { return<Component {...props} /> }} />;

};

export {
  PrivateRoute
}