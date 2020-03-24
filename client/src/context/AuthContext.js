import React, {createContext, useEffect, useState} from 'react';
import axios from 'axios';
import {withRouter} from 'react-router';
import {PageLoader} from "../component/element/page-loader/PageLoader";
import {routes} from "../routes";
import Cookies from 'js-cookie'
import {HttpResponse} from "../model/HttpResponse";

const AuthContext = createContext();

const initialSessionState = {
  username: null,
  userPicture: null,
  isAuthenticated: false,
};

const AuthContextProvider = (props) => {

  const [isLoading, setIsLoading] = useState(false);
  const [session, setSession] = useState(initialSessionState);

  useEffect(() => {
    const authenticated = Cookies.get('authenticated');
    const username = Cookies.get('username');
    const userPicture = Cookies.get('userPicture');
    if (authenticated === 'yes') {
      setSession({isAuthenticated: true, username: username, userPicture: userPicture})
    }
  }, []);

  const clearSession = () => {
    Cookies.remove('authenticated');
    Cookies.remove('username');
    Cookies.remove('userPicture');
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
    fd.append('username', data['username']);
    fd.append('email', data['email']);
    fd.append('password', data['password']);
    try {
      const res = await axios.post('/api/sign-up', fd);
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
      const res = await axios.get('/api/confirm/' + token);
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
      const res = await axios.post('/api/confirm/resend', fd);
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
      const res = await axios.post('/api/reset/password', fd);
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
      const res = await axios.get('/api/reset/' + token);
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
      await axios.post('/api/reset/' + token, fd);
      props.history.push(routes.SIGN_IN.url);
    } catch (e) {
      handleError(e);
    } finally {
      setIsLoading(false);
    }
  };

  const getUserProfile = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/api/profile");
      return new HttpResponse(res.status, res.data.message, res.data);
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

  const changePassword = async (data) => {
    setIsLoading(true);
    const fd = new FormData();
    fd.append('oldPassword', data['oldPassword']);
    fd.append('newPassword', data['newPassword']);
    try {
      const res = await axios.put("/api/profile/password", fd);
      clearSession();
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


  const changeUsername = async (data) => {
    setIsLoading(true);
    const fd = new FormData();
    fd.append('username', data['newUsername']);
    try {
      const res = await axios.put("/api/profile/username", fd);
      const username = res.data.username;
      Cookies.set('username', username);
      setSession({...session, username: username});
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

  const changeEmail = async (data) => {
    setIsLoading(true);
    const fd = new FormData();
    fd.append('email', data['email']);
    try {
      const res = await axios.put("/api/profile/email", fd);
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

  const changeUserPicture = async (data) => {
    setIsLoading(true);
    const fd = new FormData();
    fd.append('picture', data);
    try {
      const res = await axios.put('/api/profile/picture', fd, {headers: { 'content-type': 'multipart/form-data' }});
      const picture = res.data["user_picture"];
      Cookies.set('userPicture', picture);
      setSession({...session, userPicture: picture});
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

  const deleteAccount = async (data) => {
    setIsLoading(true);
    const fd = new FormData();
    fd.append('password', data['password']);
    try {
      const res = await axios.delete("/api/profile", { data: fd });
      clearSession();
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

  const getApiKey = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/api/key");
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

  const resetApiKey = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/api/key/reset");
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
      const res = await axios.delete("/api/key");
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

  const getUserPublic = async (username) => {
    setIsLoading(true);
    try {
      const res = await axios.get("/api/users/" + username);
      return new HttpResponse(res.status, res.data.message, res.data);
    } catch (e) {
      handleError(e, []);
      const res = e.hasOwnProperty('response') ? e.response : null;
      const status = res ? res.status : 500;
      const message = res ? res.data.message : "";
      return new HttpResponse(status, message);
    } finally {
      setIsLoading(false);
    }
  };

  const getFriends = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/api/profile/friends");
      return new HttpResponse(res.status, res.data.message);
    } catch (e) {
      handleError(e, []);
      const res = e.hasOwnProperty('response') ? e.response : null;
      const status = res ? res.status : 500;
      const message = res ? res.data.message : "";
      return new HttpResponse(status, message);
    } finally {
      setIsLoading(false);
    }
  };

  const addFriend = async (username) => {
    setIsLoading(true);
    const fd = new FormData();
    fd.append('username', username);
    try {
      const res = await axios.post("/api/profile/friends", fd);
      return new HttpResponse(res.status, res.data.message);
    } catch (e) {
      handleError(e, []);
      const res = e.hasOwnProperty('response') ? e.response : null;
      const status = res ? res.status : 500;
      const message = res ? res.data.message : "";
      return new HttpResponse(status, message);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteFriend = async (username) => {
    setIsLoading(true);
    const fd = new FormData();
    fd.append('username', username);
    try {
      const res = await axios.delete("/api/profile/friends", { data: fd });
      return new HttpResponse(res.status, res.data.message);
    } catch (e) {
      handleError(e, []);
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
      signIn,
      signOut,
      signUp,
      confirmEmail,
      initResetPassword,
      resendConfirmation,
      checkResetPasswordToken,
      resetPassword,
      getUserProfile,
      changePassword,
      changeUsername,
      changeEmail,
      deleteAccount,
      changeUserPicture,
      getApiKey,
      resetApiKey,
      deleteApiKey,
      getUserPublic,
      getFriends,
      addFriend,
      deleteFriend
    }}>
      { isLoading && <PageLoader/> }
      { props.children }
    </AuthContext.Provider>
  )
};

const AuthContextWithRouterProvider = withRouter(AuthContextProvider);

export {
  AuthContext,
  AuthContextWithRouterProvider
};