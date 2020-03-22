import React, {createContext, useEffect, useState} from 'react';
import axios from 'axios';
import {withRouter} from 'react-router';
import {PageLoader} from "../component/element/page-loader/PageLoader";
import {routes} from "../routes";
import Cookies from 'js-cookie'
import {HttpResponse} from "../model/HttpResponse";

export const AuthContext = createContext();

const initialSessionState = {
  username: null,
  userPicture: null,
  isAuthenticated: false,
  isOauthOnly: false
};

const AuthContextProvider = (props) => {

  const [isLoading, setIsLoading] = useState(false);
  const [session, setSession] = useState(initialSessionState);

  useEffect(() => {
    const authenticated = Cookies.get('authenticated');
    const username = Cookies.get('username');
    const userPicture = Cookies.get('userPicture');
    const oauthOnly = Cookies.get('oauthOnly');
    if (authenticated === 'yes') {
      setSession({isAuthenticated: true, username: username, userPicture: userPicture, isOauthOnly: oauthOnly === 'yes'})
    }
  }, []);

  const clearSession = () => {
    Cookies.remove('authenticated');
    Cookies.remove('username');
    Cookies.remove('userPicture');
    Cookies.remove('oauthOnly');
    setSession(initialSessionState);
  };

  const handleError = (error, codesHandle = []) => {

    const fatalError = () => {
      clearSession();
      props.history.push(routes.HOME.url);
    };

    if (!error.hasOwnProperty('response')) {
      fatalError();
      return;
    }

    const status = error.response.status;
    if (codesHandle.includes(status))
      return;

    switch (status) {
      case 401:
        clearSession();
        props.history.push(routes.SIGN_IN.url + '?redirectURI=' + props.location.pathname);
        return;

      case 400:
        return;

      case 500:
        props.history.push(routes.INTERNAL_SERVER_ERROR.url);
        return;
      case 404:
        props.history.push(routes.NOT_FOUND.url);
        return;

      default:
        fatalError();
        return;
    }
  };

  const signIn = async (data) => {

    const initSession = (username, userPicture, oauthOnly) => {
      Cookies.set('authenticated', 'yes', { expires: 365 });
      Cookies.set('username', username, { expires: 365 });
      Cookies.set('userPicture', userPicture, { expires: 365 });
      Cookies.set('oauthOnly', oauthOnly ? 'yes' : 'no', { expires: 365 });
      setSession({username: username, userPicture: userPicture, isAuthenticated: true, isOauthOnly: oauthOnly});
    };

    const get = async () => {
      return await axios.get('/api/sign-in')
    };

    const post = async (data) => {
      const username = data['usernameOrEmail'] || data['username'];
      const fd = new FormData();
      fd.append('usernameOrEmail', username);
      fd.append('password', data['password']);
      const remember = data["remember"];
      if (typeof remember !== 'undefined' && remember !== null) {
        fd.append('remember', remember);
      }
      return await axios.post('/api/sign-in', fd);
    };

    setIsLoading(true);
    try {
      const res = data ? await post(data) : await get();
      initSession(res.data.username, res.data['user_picture'], res.data['oauth_only']);
      return new HttpResponse(res.status, res.message);
    } catch (e) {
      handleError(e, [400, 401]);
      return e.hasOwnProperty('response') ? new HttpResponse(e.response.status, e.response.data.message, true) : null;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await axios.get('/api/sign-out');
    } finally {
      clearSession();
      props.history.push(routes.SIGN_IN.url);
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
      await axios.post('/api/sign-up', fd);
      props.history.push(routes.WAIT_ACCOUNT_CONFIRMATION.url(data['email']));
    } catch (e) {
      handleError(e, [409]);
      return e.response ? e.response.status : 500;
    } finally {
      setIsLoading(false);
    }
  };

  const confirmEmail = async (token) => {
    setIsLoading(true);
    try {
      const res = await axios.get('/api/confirm/' + token);
      clearSession();
      return res.status;
    } catch (e) {
      handleError(e, [409, 410]);
      return e.response ? e.response.status : 500;
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
      return e.response ? e.response.status : 500;
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
      return e.response ? e.response.status : 500;
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
      return e.response ? e.response.status : 500;
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
      return e.response ? e.response.status : 500;
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
      return e.response ? e.response.status : 500;
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
      return e.response ? e.response.status : 500;
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

  const changePassword = async (data) => {
    setIsLoading(true);
    const fd = new FormData();
    fd.append('oldPassword', data['oldPassword']);
    fd.append('newPassword', data['newPassword']);
    try {
      await axios.put("/api/profile/password", fd);
      clearSession();
      props.history.push(routes.SIGN_IN.url);
    } catch (e) {
      handleError(e);
      return e.response ? e.response.status : 500;
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
      const username = res.data.username;
      Cookies.set('username', username);
      setSession({...session, username: username});
      return res.status;
    } catch (e) {
      handleError(e, [409]);
      return e.response ? e.response.status : null;
    } finally {
      setIsLoading(false);
    }
  };

  const changeEmail = async (data) => {
    setIsLoading(true);
    const fd = new FormData();
    fd.append('email', data['email']);
    try {
      const res = await axios.put("/api/profile/email", fd);
      return res.status;
    } catch (e) {
      handleError(e, [409]);
      return e.response ? e.response.status : null;
    } finally {
      setIsLoading(false);
    }
  };

  const changeUserPicture = async (data) => {
    setIsLoading(true);
    const fd = new FormData();
    fd.append('picture', data);
    try {
      const res = await axios.put('/api/profile/picture', fd, {headers: { 'content-type': 'multipart/form-data' }});
      const picture = res.data["user_picture"];
      Cookies.set('userPicture', picture);
      setSession({...session, userPicture: picture});
      return res.status;
    } catch (e) {
      handleError(e);
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
      await axios.delete("/api/profile", { data: fd });
      clearSession();
      props.history.push(routes.SIGN_UP.url);
    } catch (e) {
      handleError(e, [401]);
      return e.response ? e.response.status : null;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{...session,
      signIn,
      signOut,
      signUp,
      confirmEmail,
      initResetPassword,
      resendConfirmation,
      checkResetPasswordToken,
      signInWithGoogle,
      signInWithFacebook,
      resetPassword,
      getUserProfile,
      changePassword,
      changeUsername,
      changeEmail,
      deleteAccount,
      changeUserPicture
    }}>
      { isLoading && <PageLoader/> }
      { props.children }
    </AuthContext.Provider>
  )
};

export default withRouter(AuthContextProvider);