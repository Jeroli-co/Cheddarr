import React, {createContext, useEffect, useState} from 'react';
import axios from "axios";
import {withRouter} from 'react-router';

export const AuthContext = createContext();

const AuthContextProvider = (props) => {

  const initialSessionState = () => {
    const username = localStorage.getItem('username');
    const expiresAt = localStorage.getItem('expiresAt');
    const isAuthenticated = !!username && !!expiresAt;
    return {
      username: username,
      expiresAt: expiresAt,
      isAuthenticated: isAuthenticated
    }
  };

  const [session, setSession] = useState(initialSessionState());

  useEffect(() => {
    if (session.expiresAt && new Date().getTime() > session.expiresAt) {
      axios.get('/api/refresh-session')
        .then((res) => {
          setSession({...res.data, isAuthenticated: true});
        }).catch((e) => {
          localStorage.removeItem('username');
          localStorage.removeItem('expiresAt');
          setSession(initialSessionState());
        });
    }
  });

  const signUp = async (data) => {
    try {
      if (!session.isAuthenticated) {
        const fd = new FormData();
        fd.append('firstName', data['firstName']);
        fd.append('lastName', data['lastName']);
        fd.append('username', data['username']);
        fd.append('email', data['email']);
        fd.append('password', data['password']);
        await axios.post('/api/sign-up', fd);
        props.history.push('/sign-in');
      } else {
        throw new Error('Try to sign up but user is authenticated');
      }
    } catch (e) {
      handleError(e);
    }
  };

  const signIn = async (data) => {
    try {
      if (!session.isAuthenticated) {
        const fd = new FormData();
        fd.append('usernameOrEmail', data['usernameOrEmail']);
        fd.append('password', data['password']);
        const res = await axios.post('/api/sign-in', fd);
        const username = res.data.username;
        const expiresAt = res.data.expiresAt;
        if (username && expiresAt) {
          doLogin(username, expiresAt);
        } else {
          throw new Error("Response data doesn't match the wanted model");
        }
      } else {
        throw new Error('Try to sign in but user is authenticated');
      }
    } catch (e) {
      handleError(e);
    }
  };

  const signOut = async () => {
    try {
      if (session.isAuthenticated) {
        await axios.get('/api/sign-out');
        doLogout();
      } else {
        throw new Error('Try to sign out but user is not authenticated');
      }
    } catch (e) {
      handleError(e);
    }
  };

  const handleError = (error) => {
    console.log(error);
    doLogout();
  };

  const doLogin = (username, expiresAt) => {
    localStorage.setItem('username', username);
    localStorage.setItem('expiresAt', expiresAt);
    setSession({isAuthenticated: true, username: username, expiresAt: expiresAt});
    props.history.push('/');
  };

  const doLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('expiresAt');
    setSession(initialSessionState());
  };

  return (
    <AuthContext.Provider value={{...session, signUp, signIn, signOut}}>
      {props.children}
    </AuthContext.Provider>
  )
};

export default withRouter(AuthContextProvider);