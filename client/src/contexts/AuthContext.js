import React, {createContext, useEffect, useState} from 'react';
import axios from 'axios';
import {withRouter} from 'react-router';
import {PageLoader} from "../elements/PageLoader";
import {routes} from "../router/routes";
import Cookies from 'js-cookie'
import {HttpResponse} from "../models/HttpResponse";
import {FriendsContextProvider} from "./FriendsContext";

const AuthContext = createContext();

const initialSessionState = {
  username: null,
  userPicture: null,
  isAuthenticated: false,
};

const AuthContextProvider = (props) => {

  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState(initialSessionState);
  const apiUrl = "/api";

  useEffect(() => {
    if (!session.isAuthenticated) {
      const authenticated = Cookies.get('authenticated');
      const username = Cookies.get('username');
      const userPicture = Cookies.get('userPicture');
      if (authenticated === 'yes') {
        setSession({isAuthenticated: true, username: username, userPicture: userPicture})
      } else {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, [session.isAuthenticated]);

  const clearSession = () => {
    Cookies.remove('authenticated');
    Cookies.remove('username');
    Cookies.remove('userPicture');
    setSession(initialSessionState);
  };

  const updateUsername = (username) => {
    Cookies.set('username', username);
    setSession({...session, username: username});
  };

  const updatePicture = (picture) => {
    Cookies.set('userPicture', picture);
    setSession({...session, userPicture: picture});
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

    const res = error.hasOwnProperty('response') ? error.response : null;
    const status = res ? res.status : 500;
    if (codesHandle.includes(status))
      return;

    switch (status) {
      case 401:
        clearSession();
        props.history.push(routes.SIGN_IN.url + '?redirectURI=' + props.location.pathname);
        return;

      case 400:
        props.history.push(routes.BAD_REQUEST.url);
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

    const initSession = (username, userPicture) => {
      Cookies.set('authenticated', 'yes', { expires: 365 });
      Cookies.set('username', username, { expires: 365 });
      Cookies.set('userPicture', userPicture, { expires: 365 });
      setSession({username: username, userPicture: userPicture, isAuthenticated: true});
    };

    const get = async () => {
      return await axios.get(apiUrl + '/sign-in/')
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
      return await axios.post(apiUrl + '/sign-in/', fd);
    };

    setIsLoading(true);
    try {
      const res = data ? await post(data) : await get();
      initSession(res.data.username, res.data['user_picture']);
      return new HttpResponse(res.status, res.data.message);
    } catch (e) {
      handleError(e, [400, 401]);
      const res = e.hasOwnProperty('response') ? e.response : null;
      const status = res ? res.status : 500;
      const message = res ? res.data.message : "";
      return new HttpResponse(status, message);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await axios.get(apiUrl + '/sign-out/');
    } finally {
      clearSession();
      props.history.push(routes.SIGN_IN.url);
      setIsLoading(false);
    }
  };

  const signUp = async (data) => {
    setIsLoading(true);
    const fd = new FormData();
    fd.append('username', data['username']);
    fd.append('email', data['email']);
    fd.append('password', data['password']);
    try {
      const res = await axios.post(apiUrl + '/sign-up/', fd);
      return new HttpResponse(res.status, res.data.message);
    } catch (e) {
      handleError(e, [409]);
      const res = e.hasOwnProperty('response') ? e.response : null;
      const status = res ? res.status : 500;
      const message = res ? res.data.message : "";
      return new HttpResponse(status, message);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmEmail = async (token) => {
    setIsLoading(true);
    try {
      const res = await axios.get(apiUrl + '/confirm/' + token + '/');
      clearSession();
      return new HttpResponse(res.status, res.data.message);
    } catch (e) {
      handleError(e, [403, 410]);
      const res = e.hasOwnProperty('response') ? e.response : null;
      const status = res ? res.status : 500;
      const message = res ? res.data.message : "";
      return new HttpResponse(status, message);
    } finally {
      setIsLoading(false);
    }
  };

   const resendConfirmation = async (email) => {
    setIsLoading(true);
    const fd = new FormData();
    fd.append('email', email);
    try {
      const res = await axios.post(apiUrl + '/confirm/resend/', fd);
      return new HttpResponse(res.status, res.data.message);
    } catch (e) {
      handleError(e, [400]);
      const res = e.hasOwnProperty('response') ? e.response : null;
      const status = res ? res.status : 500;
      const message = res ? res.data.message : "";
      return new HttpResponse(status, message);
    } finally {
      setIsLoading(false);
    }
  };

  const initResetPassword = async (data) => {
    setIsLoading(true);
    const fd = new FormData();
    fd.append('email', data['email']);
    try {
      const res = await axios.post(apiUrl + '/reset/password/', fd);
      return new HttpResponse(res.status, res.data.message);
    } catch (e) {
      handleError(e, [400]);
      const res = e.hasOwnProperty('response') ? e.response : null;
      const status = res ? res.status : 500;
      const message = res ? res.data.message : "";
      return new HttpResponse(status, message);
    } finally {
      setIsLoading(false);
    }
  };

  const checkResetPasswordToken = async (token) => {
    setIsLoading(true);
    try {
      const res = await axios.get(apiUrl + '/reset/' + token + "/");
      return new HttpResponse(res.status, res.data.message);
    } catch (e) {
      handleError(e, [410, 403]);
      const res = e.hasOwnProperty('response') ? e.response : null;
      const status = res ? res.status : 500;
      const message = res ? res.data.message : "";
      return new HttpResponse(status, message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (token, data) => {
    setIsLoading(true);
    const fd = new FormData();
    fd.append('password', data['password']);
    try {
      await axios.post(apiUrl + '/reset/' + token + "/", fd);
      props.history.push(routes.SIGN_IN.url);
    } catch (e) {
      handleError(e);
    } finally {
      setIsLoading(false);
    }
  };

  const getApiKey = async () => {
    try {
      const res = await axios.get(apiUrl + "/key");
      return new HttpResponse(res.status, "", res.data);
    } catch (e) {
      handleError(e);
      const res = e.hasOwnProperty('response') ? e.response : null;
      const status = res ? res.status : 500;
      const message = res ? res.data.message : "";
      return new HttpResponse(status, message);
    }
  };

  const resetApiKey = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(apiUrl + "/key/reset");
      return new HttpResponse(res.status, "", res.data);
    } catch (e) {
      handleError(e);
      const res = e.hasOwnProperty('response') ? e.response : null;
      const status = res ? res.status : 500;
      const message = res ? res.data.message : "";
      return new HttpResponse(status, message);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteApiKey = async () => {
    setIsLoading(true);
    try {
      const res = await axios.delete(apiUrl + "/key");
      return new HttpResponse(res.status, res.data.message);
    } catch (e) {
      handleError(e);
      const res = e.hasOwnProperty('response') ? e.response : null;
      const status = res ? res.status : 500;
      const message = res ? res.data.message : "";
      return new HttpResponse(status, message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{...session,
      handleError,
      clearSession,
      isLoading,
      apiUrl,
      signIn,
      signOut,
      signUp,
      confirmEmail,
      initResetPassword,
      resendConfirmation,
      checkResetPasswordToken,
      resetPassword,
      getApiKey,
      resetApiKey,
      deleteApiKey,
      updateUsername,
      updatePicture
    }}>
      <FriendsContextProvider>
        { props.children }
      </FriendsContextProvider>
      { isLoading && <PageLoader/> }
    </AuthContext.Provider>
  )
};

const AuthContextWithRouterProvider = withRouter(AuthContextProvider);

export {
  AuthContext,
  AuthContextWithRouterProvider
};