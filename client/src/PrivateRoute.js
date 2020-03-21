import {useContext, useEffect, useState} from "react";
import {AuthContext} from "./context/AuthContext";
import {Redirect, Route} from "react-router";
import React from "react";
import {routes} from "./routes";

const PrivateRoute = ({component: Component, location, ...rest}) => {

  const { signIn } = useContext(AuthContext);
  const [refreshState, setRefreshState] = useState({ status: null, redirect: null });

  useEffect(() => {
    if (refreshState.status === null) {
      signIn(null, [401]).then((code) => {
        setRefreshState({ status: code, redirect: location.pathname });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (refreshState.status === null)
    return <div/>;

  if (refreshState.status === 401)
    return <Redirect to={routes.CONFIRM_PASSWORD.url + '?redirect=' + refreshState.redirect}/>;

  if (refreshState.status === 200)
    return <Route {...rest} render={(props) => { return<Component {...props} /> }} />;

};

export {
  PrivateRoute
}