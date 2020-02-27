import React from 'react';
import {Route, Switch} from "react-router-dom";
import './App.css';
import Navbar from "./component/navbar/Navbar";
import SignIn from "./component/sign-in/SignIn";
import SignUp from "./component/sign-up/SignUp";
import Home from "./home/Home";
import AuthContextProvider from "./context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import UserProfile from "./component/protected/user-profile/UserProfile";
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';

const App = () => {

  config.autoAddCss = false;

  return (
    <div className="App">
      <AuthContextProvider>
        <Navbar />
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/sign-in' component={SignIn} />
          <Route exact path='/sign-up' component={SignUp} />

          <ProtectedRoute exact path="/user-profile" component={UserProfile} />
          <Route path="*" component={() => "404 NOT FOUND"} />
        </Switch>
      </AuthContextProvider>
    </div>
  );
};

export default App;
