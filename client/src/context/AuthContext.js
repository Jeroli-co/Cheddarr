import React, {createContext, useEffect, useState} from 'react';
import axios from 'axios';
import {withRouter} from 'react-router';
import {PageLoader} from "../component/element/page-loader/PageLoader";
import {routes} from "../routes";

export const AuthContext = createContext();

const initialSessionState = {
  userPicture: null,
  username: null,
  expiresAt: null,
  isAuthenticated: false
};

const AuthContextProvider = (props) => {

  const [isLoading, setIsLoading] = useState(false);
  const [session, setSession] = useState(initialSessionState);

  useEffect(() => {
    loadSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isSessionExpired()) {
      refreshSession().then(() => {console.log('Session refreshed')});
    }
  });

  const refreshSession = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('/api/refresh-session');
      updateSession(res.data.user_picture, res.data.username, res.data.expires_in);
      return res.status;
    } catch (e) {
      handleError(e);
      return e.response ? e.response.status : 404;
    } finally {
      setIsLoading(false)
    }
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
      updateSession(res.data.user_picture, res.data.username, res.data.expires_in);
      return res.status;
    } catch (e) {
      handleError(e, [400, 401]);
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
      handleError(e);
      return e.response ? e.response.status : 404;
    } finally {
      clearSession();
      props.history.push(routes.SIGN_IN.url);
      setIsLoading(false);
    }
  };

  const confirmAccount = async (token) => {
    setIsLoading(true);
    try {
      const res = await axios.get('/api/confirm/' + token);
      return res.status;
    } catch (e) {
      handleError(e, [409, 410]);
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
      handleError(e, [410]);
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
      return res.status;
    } catch (e) {
      handleError(e);
      return e.response ? e.response.status : 404;
    } finally {
      setIsLoading(false);
    }
  };

  const updateSession = (userPicture, username, expiresAt) => {
    localStorage.setItem('userPicture', userPicture);
    localStorage.setItem('username', username);
    localStorage.setItem('expiresAt', expiresAt);
    setSession({userPicture: userPicture, username: username, expiresAt: expiresAt, isAuthenticated: true});
  };

  const loadSession = () => {
    const userPicture = localStorage.getItem('userPicture');
    const username = localStorage.getItem('username');
    const expiresAt = localStorage.getItem('expiresAt');
    if (userPicture && username && expiresAt) {
      if (isSessionExpired()) {
        refreshSession().then(() => console.log("Session refreshed"));
      } else {
        setSession({userPicture: userPicture, username: username, expiresAt: expiresAt, isAuthenticated: true});
      }
    } else {
      props.history.push(routes.HOME.url);
    }
  };

  const clearSession = () => {
    localStorage.removeItem('userPicture');
    localStorage.removeItem('username');
    localStorage.removeItem('expiresAt');
    setSession(initialSessionState);
  };

  const isSessionExpired = () => {
    const expiresAt = session.expiresAt || localStorage.getItem('expiresAt');
    return expiresAt && new Date().getTime() > expiresAt;
  };

  const handleError = (error, codesHandle = []) => {
    clearSession();
    const response = error.response;
    if (response) {
      const status = response.status;
      if (!codesHandle.includes(status)) {
        if (status === 404) {
          props.history.push(routes.NOT_FOUND.url);
        } else {
          props.history.push(routes.HOME.url);
        }
      }
    }
  };

  const getUserProfile = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/api/user/" + session.username);
      return res.data;
    } catch (e) {
      handleError(e);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (data) => {
    setIsLoading(true);
    const fd = new FormData();
    fd.append('oldPassword', data['oldPassword']);
    fd.append('newPassword', data['newPassword']);
    try {
      const res = await axios.post("/change/password", fd);
      return res.status;
    } catch (e) {
      handleError(e);
      return e.response ? e.response.status : 404;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{...session,
      refreshSession,
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
      getUserProfile,
      changePassword
    }}>
      { isLoading && <PageLoader/> }
      { props.children }
    </AuthContext.Provider>
  )
};

export default withRouter(AuthContextProvider);