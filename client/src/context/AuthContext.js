import React, {createContext, useEffect, useState} from 'react';
import axios from 'axios';
import {withRouter} from 'react-router';
import PageLoader from "../component/element/page-loader/PageLoader";

export const AuthContext = createContext();

const AuthContextProvider = (props) => {

  const initialSessionState = {
    username: null,
    expiresAt: null,
    isAuthenticated: false
  };

  const [isLoading, setIsLoading] = useState(false);
  const [session, setSession] = useState(initialSessionState);

  useEffect(() => {
    if (session.expiresAt === null) {
      const expiresAt = localStorage.getItem('expiresAt');
      if (expiresAt) {
        refreshSession();
      }
    }
  }, []);

  useEffect(() => {
    if (session.expiresAt && isExpired(session.expiresAt)) {
      refreshSession();
    }
  });

  const refreshSession = () => {
    axios.get('/api/refresh-session')
      .then((res) => {
        updateSession(res.data.username, res.data.expiresAt);
      })
      .catch((e) => {
        handleError(e);
      });
  };

  const isExpired = (expiresAt) => {
    return new Date().getTime() > expiresAt;
  };

  const signUp = async (data) => {
    setIsLoading(true);
    const fd = new FormData();
    fd.append('firstName', data['firstName']);
    fd.append('lastName', data['lastName']);
    fd.append('username', data['username']);
    fd.append('email', data['email']);
    fd.append('password', data['password']);
    try {
      await axios.post('/api/sign-up', fd);
      props.history.push('/confirm/account');
    } catch (e) {
      handleError(e);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (data) => {
    setIsLoading(true);
    const fd = new FormData();
    fd.append('usernameOrEmail', data['usernameOrEmail']);
    fd.append('password', data['password']);
    fd.append('remember', data['remember']);
    try {
      const res = await axios.post('/api/sign-in', fd);
      updateSession(res.data.username, res.data.expiresAt);
    } catch (e) {
      handleError(e);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await axios.get('/api/sign-out');
      clearSession();
    } catch (e) {
      handleError(e);
    } finally {
      props.history.push('/');
    }
  };

  const handleError = (error) => {
    console.log(error);
    clearSession();
  };

  const updateSession = (username, expiresAt) => {
    localStorage.setItem('username', username);
    localStorage.setItem('expiresAt', expiresAt);
    setSession({username: username, expiresAt: expiresAt, isAuthenticated: true, isFresh: true});
  };

  const clearSession = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('expiresAt');
    setSession(initialSessionState);
  };

  return (
    <AuthContext.Provider value={{...session, signUp, signIn, signOut}}>
      { isLoading && <PageLoader/> }
      { props.children }
    </AuthContext.Provider>
  )
};

export default withRouter(AuthContextProvider);