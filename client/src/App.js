import React from 'react';
import {Route, Switch} from "react-router-dom";
import './App.css';
import Navbar from "./component/navbar/Navbar";
import SignIn from "./component/protected/sign-in/SignIn";
import SignUp from "./component/protected/sign-up/SignUp";
import Home from "./component/public/home/Home";
import AuthContextProvider from "./context/AuthContext";
import PrivateRoute from "./routes/PrivateRoute";
import UserProfile from "./component/private/user-profile/UserProfile";
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import ProtectedRoute from "./routes/ProtectedRoute";
import ConfirmAccount from "./component/public/confirm-account/ConfirmAccount";
import WaitingAccountConfirmation from "./component/public/waiting-account-confirmation/WaitingAccountConfirmation";

const App = () => {

  config.autoAddCss = false;

  return (
    <div className="App">
      <AuthContextProvider>
        <Navbar />
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/confirm/:token' component={ConfirmAccount} />
          <Route exaxt path='/confirm/account' component={WaitingAccountConfirmation} />

          <ProtectedRoute exact path='/sign-in' component={SignIn} />
          <ProtectedRoute exact path='/sign-up' component={SignUp} />

          <PrivateRoute exact path="/user-profile" component={UserProfile} />

          <Route path="*" component={() => "404 NOT FOUND"} />
        </Switch>
      </AuthContextProvider>
    </div>
  );
};

export default App;
