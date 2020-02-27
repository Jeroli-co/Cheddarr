import React, { createContext, useState } from 'react';
import axios from "axios";
import {withRouter} from 'react-router';

export const AuthContext = createContext();

const AuthContextProvider = (props) => {

  const [user, setUser] = useState({
    isAuthenticated: false,
  });

  const signUp = async (data) => {
    try {
      if (!user.isAuthenticated) {
        const fd = new FormData();
        fd.append('firstName', data['firstName']);
        fd.append('lastName', data['lastName']);
        fd.append('username', data['username']);
        fd.append('email', data['email']);
        fd.append('password', data['password']);
        const res = await axios.post('/api/sign-up', fd);
        console.log(res);
        props.history.push('/sign-in');
      } else {
        throw 'Already authenticated';
      }
    } catch (e) {
      console.log(e);
    }
  };

  const signIn = async (data) => {
    try {
      if (!user.isAuthenticated) {
        const fd = new FormData();
        fd.append('usernameOrEmail', data['usernameOrEmail']);
        fd.append('password', data['password']);
        const res = await axios.post('/api/sign-in', fd);
        console.log(res);
        setUser({isAuthenticated: true, info: res.payload});
        props.history.push('/user-profile');
      } else {
        throw 'Already authenticated';
      }
    } catch (e) {
      console.log(e);
    }
  };

  const signOut = async () => {
    try {
      if (user.isAuthenticated) {
        const res = await axios.get('/api/sign-out');
        console.log(res);
        setUser({isAuthenticated: false});
        props.history.push('/');
      } else {
        throw 'Not authenticated yet';
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getProfile = async () => {
    try {
      if (user.isAuthenticated) {
        const res = await axios.get('/api/profile');
        console.log(res);
        setUser({info: res.payload});
      } else {
        throw 'Not authenticated yet';
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <AuthContext.Provider value={{...user, signUp, signIn, signOut, getProfile}}>
      {props.children}
    </AuthContext.Provider>
  )
};

export default withRouter(AuthContextProvider);