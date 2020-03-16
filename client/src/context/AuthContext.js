import React, {createContext, useEffect, useState} from 'react';
import axios from 'axios';
import {withRouter} from 'react-router';
import {PageLoader} from "../component/element/page-loader/PageLoader";
import {routes} from "../routes";

export const AuthContext = createContext();

const initialSessionState = {
  username: null,
  expiresAt: null,
  isAuthenticated: false
};

const AuthContextProvider = (props) => {

  const [isLoading, setIsLoading] = useState(false);
  const [session, setSession] = useState(initialSessionState);

  useEffect(() => {
    if (session.expiresAt === null) {
      const expiresAt = localStorage.getItem('expiresAt');
      if (expiresAt) {
        refreshSession();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (session.expiresAt && isExpired(session.expiresAt)) {
      refreshSession();
    }
  });

  const signUp = async (data) => {
    setIsLoading(true);
    const fd = new FormData();
    fd.append('firstName', data['firstName']);
    fd.append('lastName', data['lastName']);
    fd.append('username', data['username']);
    fd.append('email', data['email']);
    fd.append('password', data['password']);
    try {
      const res = await axios.post('/api/sign-up', fd);
      props.history.push(routes.WAIT_ACCOUNT_CONFIRMATION.url(data['email']));
      return res.status;
    } catch (e) {
      handleError(e);
      return e.response ? e.response.status : 404;
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
      return res.status;
    } catch (e) {
      handleError(e);
      return e.response ? e.response.status : 404;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('/api/sign-out');
      return res.status;
    } catch (e) {
      return e.response ? e.response.status : 404;
    } finally {
      clearSession();
      props.history.push(routes.HOME.url);
      setIsLoading(false);
    }
  };

  const isExpired = (expiresAt) => {
    return new Date().getTime() > expiresAt;
  };

  const refreshSession = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('/api/refresh-session');
      updateSession(res.data.username, res.data.expiresAt);
      return res.status;
    } catch (e) {
      handleError(e);
      return e.response ? e.response.status : 404;
    } finally {
      setIsLoading(false);
    }
  };

  const confirmAccount = async (token) => {
    setIsLoading(true);
    try {
      const res = await axios.get('/api/confirm/' + token);
      return res.status;
    } catch (e) {
      handleError(e);
      return e.response ? e.response.status : 404;
    } finally {
      setIsLoading(false);
    }
  };

   const resendConfirmation = async (email) => {
    setIsLoading(true);
    const fd = new FormData();
    fd.append('email', email);
    try {
      const res = await axios.post('/api/confirm/resend', fd);
      return res.status;
    } catch (e) {
      handleError(e);
      return e.response ? e.response.status : 404;
    } finally {
      setIsLoading(false);
    }
  };

  const initResetPassword = async (data) => {
    setIsLoading(true);
    const fd = new FormData();
    fd.append('email', data['email']);
    try {
      const res = await axios.post('/api/reset/password', fd);
      return res.status;
    } catch (e) {
      handleError(e);
      return e.response ? e.response.status : 404;
    } finally {
      setIsLoading(false);
    }
  };

  const checkResetPasswordToken = async (token) => {
    setIsLoading(true);
    try {
      const res = await axios.get('/api/reset/' + token);
      return res.status;
    } catch (e) {
      handleError(e);
      return e.response ? e.response.status : 404;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (token, data) => {
    setIsLoading(true);
    const fd = new FormData();
    fd.append('password', data['password']);
    try {
      const res = await axios.post('/api/reset/' + token, fd);
      props.history.push(routes.SIGN_IN.url);
      // TODO: Add notif
      return res.status;
    } catch (e) {
      handleError(e);
      return e.response ? e.response.status : 404;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/api/sign-in/google");
      window.location = res.headers.location;
      //window.open(res.headers.location, "_blank","toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=400,height=400");
      return res.status;
    } catch (e) {
      handleError(e);
      return e.response ? e.response.status : 404;
    } finally {
      setIsLoading(false);
    }
  };


  const signInWithFacebook = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/api/sign-in/facebook");
      window.location = res.headers.location;
      //window.open(res.headers.location, "","height=200,width=200,modal=yes,alwaysRaised=yes");
      return res.status;
    } catch (e) {
      handleError(e);
      return e.response ? e.response.status : 404;
    } finally {
      setIsLoading(false);
    }
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

  const handleError = (error) => {
    console.log(error);
    clearSession();
  };

  return (
    <AuthContext.Provider value={{...session,
      signUp,
      signIn,
      signInWithGoogle,
      signInWithFacebook,
      signOut,
      resendConfirmation,
      initResetPassword,
      checkResetPasswordToken,
      resetPassword,
      confirmAccount,
      refreshSession,
    }}>
      { isLoading && <PageLoader/> }
      { props.children }
    </AuthContext.Provider>
  )
};

export default withRouter(AuthContextProvider);