import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import axios from "axios";
import Cookies from "js-cookie";
import React, { useState } from 'react';
import { Route } from "react-router";
import './App.css';
import Navbar from "./component/navbar/Navbar";
import SignIn from "./component/sign-in/SignIn";
import SignUp from "./component/sign-up/SignUp";
import { userContext } from "./context/userContext";
import Home from "./home/Home";


function App() {

  config.autoAddCss = false

  const initialState = {
    user: {},
    token: {
      token: "",
      expirationDate: null
    },
    logout: logOut,
    signUp: signUp,
    isAuthenticated: isAuthenticated
  };

  const [user, setUser] = useState(initialState);

  const logOut = () => {
    setUser(initialState);
  };

  const isAuthenticated = () => {
    return user.token.expirationDate && new Date().getTime() < user.token.expirationDate;
  };

  const signUp = (data) => {
    if (!isAuthenticated()) {
      console.log('Login');

      const fd = new FormData();
      fd.append('firstName', data['firstName']);
      fd.append('lastName', data['lastName']);
      fd.append('username', data['username']);
      fd.append('email', data['email']);
      fd.append('password', data['password']);
      axios.post('/api/sign-up', fd)
        .then((res) => {
          console.log(res);
          const sessionCookie = Cookies.get('session');
          if (sessionCookie) {
            console.log(sessionCookie);
            setUser({
              token: sessionCookie
            });
          }
        })
        .catch((error) => {
          console.log(error);
          // 409 EXIST DEJA
          // 500 INTERNAL ERROR probleme de validation du form
        });
    } else {
      console.log('Already authenticated');
    }
    return null;
  };

  console.log(process.env.REACT_APP_TOKEN_SECRET_KEY);

  return (
    <div className="App">
      <userContext.Provider value={user}>
        <Navbar />
        <Route exact path='/' component={Home} />
        <Route exact path='/sign-in' component={SignIn} />
        <Route exact path='/sign-up' component={SignUp} />
      </userContext.Provider>
    </div>
  );
}

export default App;
