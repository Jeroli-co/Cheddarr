import React, {createContext, useEffect, useState} from 'react';
import axios from 'axios';
import {withRouter} from 'react-router';
import {PageLoader} from "../component/element/page-loader/PageLoader";
import {routes} from "../routes";
import Cookies from 'js-cookie'

export const AuthContext = createContext();

const initialSessionState = {
  username: null,
  isAuthenticated: false
};

const AuthContextProvider = (props) => {

  const [isLoading, setIsLoading] = useState(false);
  const [session, setSession] = useState(initialSessionState);

  useEffect(() => {
    const authenticated = Cookies.get('authenticated');
    const username = Cookies.get('username');
    if (authenticated === 'yes' && username) {
      setSession({username: username, isAuthenticated: true});
    }
  }, []);

  const clearSession = () => {
    setSession(initialSessionState);
    Cookies.remove('authenticated');
    Cookies.remove('username');
  };

  const handleError = (error) => {
    console.log(error);
    clearSession();
  };

  const signIn = async (data) => {

    const get = async () => {
      return await axios.get('/api/sign-in')
    };

    const post = async (data) => {
      const fd = new FormData();
      fd.append('usernameOrEmail', data['usernameOrEmail']);
      fd.append('password', data['password']);
      fd.append('remember', data['remember']);
      return await axios.post('/api/sign-in', fd);
    };

    const initSession = (username) => {
      setSession({username: username, isAuthenticated: true});
      Cookies.set('authenticated', 'yes', { expires: 365 });
      Cookies.set('username', username, { expires: 365 });
    };

    setIsLoading(true);

    try {
      const res = data ? await post(data) : await get();
      initSession(res.data.username);
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
      return e.response ? e.response.status : 404;
    } finally {
      props.history.push(routes.HOME.url);
      clearSession();
      setIsLoading(false);
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
      const res = await axios.put("/api/profile/password", fd);
      return res.status;
    } catch (e) {
      handleError(e);
      return e.response ? e.response.status : 404;
    } finally {
      setIsLoading(false);
    }
  };


  const changeUsername = async (data) => {
    setIsLoading(true);
    const fd = new FormData();
    fd.append('newUsername', data['newUsername']);
    try {
      const res = await axios.put("/api/profile/username", fd);
      return res.status;
    } catch (e) {
      handleError(e, [409]);
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
      getUserProfile,
      changePassword,
      changeUsername,
      deleteAccount
    }}>
      { isLoading && <PageLoader/> }
      { props.children }
    </AuthContext.Provider>
  )
};

export default withRouter(AuthContextProvider);