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
      refreshSession();
    }
  });

  const loadSession = () => {
    const userPicture = localStorage.getItem('userPicture');
    const username = localStorage.getItem('username');
    const expiresAt = localStorage.getItem('expiresAt');
    if (userPicture && username && expiresAt) {
      if (isSessionExpired()) {
        refreshSession();
      } else {
        setSession({userPicture: userPicture, username: username, expiresAt: expiresAt, isAuthenticated: true});
      }
    }
  };

  const refreshSession = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('/api/refresh-session');
      updateSession(res.data.user_picture, res.data.username, res.data.expires_in);
      return res.status;
    } catch (e) {
      handleError(e);
      return e.response ? e.response.status : null;
    } finally {
      setIsLoading(false)
    }
  };

  const updateSession = (userPicture, username, expiresAt) => {
    localStorage.setItem('userPicture', userPicture);
    localStorage.setItem('username', username);
    localStorage.setItem('expiresAt', expiresAt);
    setSession({userPicture: userPicture, username: username, expiresAt: expiresAt, isAuthenticated: true});
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
      return e.response ? e.response.status : null;
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
      return e.response ? e.response.status : null;
    } finally {
      setIsLoading(false);
    }
  };

  const checkPassword = async (data) => {
    setIsLoading(true);
    const fd = new FormData();
    fd.append('username', data['username']);
    fd.append('password', data['password']);
    try {
      const res = await axios.post('/api/sign-in', fd);
      updateSession(res.data.user_picture, res.data.username, res.data.expires_in);
      return res.status;
    } catch (e) {
      handleError(e);
      return e.response ? e.response.status : null;
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
      return e.response ? e.response.status : null;
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
      return e.response ? e.response.status : null;
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
      return e.response ? e.response.status : null;
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
      return e.response ? e.response.status : null;
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
      return e.response ? e.response.status : null;
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
      return e.response ? e.response.status : null;
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
      return e.response ? e.response.status : null;
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
      return e.response ? e.response.status : null;
    } finally {
      setIsLoading(false);
    }
  };

  const getUserProfile = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/api/profile");
      return res.data;
    } catch (e) {
      handleError(e);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (data = null) => {

    const getFresh = async () => {
      return await axios.get('/api/profile/password');
    };

    const putData = async (data) => {
      const fd = new FormData();
      fd.append('oldPassword', data['oldPassword']);
      fd.append('newPassword', data['newPassword']);
      return await axios.put('/api/profile/password', fd);
    };

    setIsLoading(true);
    try {
      const res = data ? await putData(data) : await getFresh();
      return res.status;
    } catch (e) {
      handleError(e, [401]);
      return e.response ? e.response.status : null;
    } finally {
      setIsLoading(false);
    }
  };

  const changeUsername = async (data) => {

    const getFresh = async () => {
      return await axios.get('/api/profile/username');
    };

    const putData = async () => {
      const fd = new FormData();
      fd.append('newUsername', data['newUsername']);
      return await axios.put("/api/profile/username", fd);
    };

    setIsLoading(true);
    try {
      const res = data ? putData() : getFresh();
      return res.status;
    } catch (e) {
      handleError(e, [401, 409]);
      return e.response ? e.response.status : null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAccount = async (data) => {
    setIsLoading(true);
    const fd = new FormData();
    fd.append('password', data['password']);
    try {
      const res = await axios.delete("/api/profile", { data: fd });
      clearSession();
      props.history.push(routes.SIGN_IN.url);
      return res.status;
    } catch (e) {
      handleError(e, [401]);
      return e.response ? e.response.status : null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = (error, codesHandle = []) => {
    const response = error.response;
    if (response) {
      const status = response.status;
      if (!codesHandle.includes(status)) {
        clearSession();
        switch (status) {
          case 404:
            props.history.push(routes.NOT_FOUND.url);
            break;
          case 500:
            props.history.push(routes.INTERNAL_SERVER_ERROR.url);
            break;
          default:
            props.history.push(routes.HOME.url);
        }
      }
    } else {
      clearSession();
      props.history.push(routes.HOME.url);
    }
  };

  return (
    <AuthContext.Provider value={{...session,
      signUp,
      signIn,
      checkPassword,
      signInWithGoogle,
      signInWithFacebook,
      signOut,
      resendConfirmation,
      initResetPassword,
      checkResetPasswordToken,
      resetPassword,
      confirmAccount,
      getUserProfile,
      changePassword,
      changeUsername,
      deleteAccount,
      refreshSession
    }}>
      { isLoading && <PageLoader/> }
      { props.children }
    </AuthContext.Provider>
  )
};

export default withRouter(AuthContextProvider);