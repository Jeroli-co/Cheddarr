import React, { createContext, useState } from 'react';
import axios from "axios";
import {withRouter} from 'react-router';

export const AuthContext = createContext();

const AuthContextProvider = (props) => {

  const initialSessionState = {
    username: null,
    expiresAt: null
  };

  const [session, setSession] = useState(initialSessionState);

  const signUp = async (data) => {
    try {
      if (await !isAuthenticated) {
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
      if (await !isAuthenticated) {
        const fd = new FormData();
        fd.append('usernameOrEmail', data['usernameOrEmail']);
        fd.append('password', data['password']);
        const res = await axios.post('/api/sign-in', fd);
        console.log(res);
        setSessionInfo(res.data.username, res.data.expiresAt);
      }
    } catch (e) {
      console.log(e);
    } finally {
      props.history.push('/');
    }
  };

  const signOut = async () => {
    try {
      if (await isAuthenticated) {
        const res = await axios.get('/api/sign-out');
        console.log(res);
      } else {
        throw new Error('Not authenticated yet');
      }
    } catch (e) {
      console.log(e);
    } finally {
      unsetSessionInfo();
      props.history.push('/');
    }
  };

  const refreshSession = async () => {
    let sessionRefreshed = false;
    try {
      const res = await axios.get('/api/refresh-session');
      console.log(res);
      setSessionInfo(res.data.username, res.data.expiresAt);
      sessionRefreshed = true;
    } catch (e) {
      console.log(e);
      unsetSessionInfo();
    }
    return sessionRefreshed;
  };

  const isAuthenticated = async () => {
    let authenticated = false;
    try {
      const expiresAt = getExpiresAt();
      if (expiresAt) {
        authenticated = new Date().getTime() < expiresAt ? true : await refreshSession();
      }
    } catch (e) {
      console.log(e);
    }
    return authenticated;
  };

  const getExpiresAt = () => {
    return localStorage.getItem('expiresAt');
  };

  const setSessionInfo = (username, expiresAt) => {
    localStorage.setItem('username', username);
    localStorage.setItem('expiresAt', expiresAt);
    setSession({username: username, expiresAt: expiresAt});
  };

  const unsetSessionInfo = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('expiresAt');
    setSession(initialSessionState);
  };

  const getProfile = async () => {
    try {
      if (await isAuthenticated) {
        const res = await axios.get('/api/profile');
        console.log(res);
      } else {
        throw new Error('Not authenticated yet');
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <AuthContext.Provider value={{...session, signUp, signIn, signOut}}>
      {props.children}
    </AuthContext.Provider>
  )
};

export default withRouter(AuthContextProvider);