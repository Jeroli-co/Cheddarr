import React, {createContext, useEffect, useState} from 'react';
import axios from "axios";
import {withRouter} from 'react-router';

export const AuthContext = createContext();

const AuthContextProvider = (props) => {

  const initialSessionState = {
    isAuthenticated: false,
    username: null,
    expiresAt: null
  };

  const [session, setSession] = useState(initialSessionState);

  useEffect(() => {

    async function fetchSession() {
      try {
        if (session.expiresAt === null) {
          const expiresAt = localStorage.getItem('expiresAt');
          if (expiresAt && new Date().getTime() > expiresAt) {
            await refreshSession();
          }
        } else {
          if (new Date().getTime() > session.expiresAt) {
            await refreshSession();
          }
        }
      } catch (e) {
        console.log(e);
      }
    }

    fetchSession().then(() => console.log('Session refreshed'))

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
        const res = await axios.post('/api/sign-up', fd);
        console.log(res);
        props.history.push('/sign-in');
      } else {
        props.history.push('/');
      }
    } catch (e) {
      console.log(e);
    }
  };

  const signIn = async (data) => {
    try {
      if (!session.isAuthenticated) {
        const fd = new FormData();
        fd.append('usernameOrEmail', data['usernameOrEmail']);
        fd.append('password', data['password']);
        const res = await axios.post('/api/sign-in', fd);
        console.log(res);
        setSessionInfo(res.data.username, res.data.expiresAt);
        props.history.push('/');
      }
    } catch (e) {
      console.log(e);
    }
  };

  const signOut = async () => {
    try {
      const res = await axios.get('/api/sign-out');
      console.log(res);
    } catch (e) {
      console.log(e);
      console.log(session.isAuthenticated);
    }
    unsetSessionInfo();
    props.history.push('/');
  };

  const setSessionInfo = (username, expiresAt) => {
    localStorage.setItem('username', username);
    localStorage.setItem('expiresAt', expiresAt);
    setSession({isAuthenticated: true, username: username, expiresAt: expiresAt});
  };

  const unsetSessionInfo = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('expiresAt');
    setSession(initialSessionState);
  };

  const refreshSession = async () => {
    try {
      const res = await axios.get('/api/refresh-session');
      console.log(res);
      setSessionInfo(res.data.username, res.data.expiresAt);
    } catch (e) {
      console.log(e);
      unsetSessionInfo();
    }
  };

  return (
    <AuthContext.Provider value={{...session, signUp, signIn, signOut}}>
      {props.children}
    </AuthContext.Provider>
  )
};

export default withRouter(AuthContextProvider);