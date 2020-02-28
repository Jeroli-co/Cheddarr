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
      let hasSessionBeenRefreshed = false;
      try {
        if (session.expiresAt === null) {
          const expiresAt = localStorage.getItem('expiresAt');
          if (expiresAt && new Date().getTime() > expiresAt) {
            hasSessionBeenRefreshed = await refreshSession();
          }
        } else {
          if (new Date().getTime() > session.expiresAt) {
            hasSessionBeenRefreshed = await refreshSession();
          }
        }
      } catch (e) {
        console.log(e);
      }
      return hasSessionBeenRefreshed;
    }

    fetchSession().then((hasSessionBeenRefreshed) => console.log('Session refreshed: ' + hasSessionBeenRefreshed))

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
        throw new Error('Try to sign up but user is authenticated');
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
        const res = await axios.get('/api/sign-out');
        console.log(res);
        unsetSessionInfo();
        props.history.push('/');
      } else {
        throw new Error('Try to sign out but user is not authenticated');
      }
    } catch (e) {
      handleError(e);
    }
  };

  const refreshSession = async () => {
    let hasSessionBeenRefreshed = false;
    try {
      const res = await axios.get('/api/refresh-session');
      console.log(res);
      setSessionInfo(res.data.username, res.data.expiresAt);
      hasSessionBeenRefreshed = true;
    } catch (e) {
      handleError(e);
    }
    return hasSessionBeenRefreshed;
  };

  const handleError = (error) => {
    console.log(error);
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

  return (
    <AuthContext.Provider value={{...session, signUp, signIn, signOut}}>
      {props.children}
    </AuthContext.Provider>
  )
};

export default withRouter(AuthContextProvider);