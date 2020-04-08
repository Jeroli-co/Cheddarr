import React, {createContext, useEffect, useState} from 'react';
import {withRouter} from 'react-router-dom';
import {routes} from "../router/routes";
import Cookies from 'js-cookie'
import {useApi} from "../hooks/useApi";

const AuthContext = createContext();

const initialSessionState = {
  isAuthenticated: false,
  username: null,
  userPicture: null,
  isLoading: true,
};

const plexAuthorizeUri = "/plex/authorize/";

const AuthContextProvider = (props) => {

  const [session, setSession] = useState(initialSessionState);
  const { executeRequest, methods } = useApi();

  useEffect(() => {

    if (props.location.pathname === plexAuthorizeUri) {
      authorizePlex(props.location.search).then(() => {});
      return;
    }

    if (session.isLoading) {
      const authenticated = Cookies.get('authenticated');
      const username = Cookies.get('username');
      const userPicture = Cookies.get('userPicture');
      if (authenticated === 'yes') {
        initSession(username, userPicture);
      } else {
        setSession({...initialSessionState, isLoading: false});
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initSession = (username, userPicture) => {
    Cookies.set('authenticated', 'yes', { expires: 365 });
    Cookies.set('username', username, { expires: 365 });
    Cookies.set('userPicture', userPicture, { expires: 365 });
    setSession({...session, isAuthenticated: true, username: username, userPicture: userPicture, isLoading: false});
  };

  const clearSession = () => {
    Cookies.remove('authenticated');
    Cookies.remove('username');
    Cookies.remove('userPicture');
    setSession({...initialSessionState, isLoading: false});
  };

  const signIn = async (data, redirectURI) => {

    const get = async () => {
      return await executeRequest(methods.GET, "/sign-in/");
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
      return await executeRequest(methods.POST, "/sign-in/", fd);
    };

    const res = data ? await post(data) : await get();
    switch (res.status) {
      case 200:
        initSession(res.data.username, res.data['user_picture']);
        props.history.push(redirectURI);
        return res;
      case 400:
      case 401:
        return res;
      default:
        handleError(res);
        return null;
    }
  };

  const signInWithPlex = async (redirectURI) => {
    const res = await executeRequest(methods.GET, "/sign-in/plex/?redirectURI=" + redirectURI);
    switch (res.status) {
      case 200:
        window.location.href = res.headers.location;
        return res;
      default:
        handleError(res);
        return null;
    }
  };

  const authorizePlex = async (search) => {
    const res = await executeRequest(methods.GET, "/plex/authorize/" + search);
    switch (res.status) {
      case 200:
        initSession(res.data.username, res.data["user_picture"]);
        let redirectURI = res.headers["redirect-uri"];
        redirectURI = redirectURI && redirectURI.length > 0 ? redirectURI : routes.HOME.url;
        props.history.push(redirectURI);
        return res;
      default:
        handleError(res);
        return null;
    }
  };

  const signOut = async () => {
    await executeRequest(methods.GET, "/sign-out/");
    clearSession();
    props.history.push(routes.SIGN_IN.url);
  };

  const signUp = async (data) => {
    const fd = new FormData();
    fd.append('username', data['username']);
    fd.append('email', data['email']);
    fd.append('password', data['password']);
    const res = await executeRequest(methods.POST, "/sign-up/", fd);
    switch (res.status) {
      case 201:
      case 409:
        return res;
      default:
        handleError(res);
        return null;
    }
  };

  const confirmEmail = async (token) => {
    const res = await executeRequest(methods.GET, "/confirm/" + token + "/");
    switch (res.status) {
      case 200:
        clearSession();
        return res;
      case 403:
      case 410:
        return res;
      default:
        handleError(res);
        return null;
    }
  };

   const resendConfirmation = async (email) => {
     const fd = new FormData();
     fd.append('email', email);
     const res = await executeRequest(methods.POST, "/confirm/resend/", fd);
     switch (res.status) {
       case 200:
       case 400:
         return res;
       default:
         handleError(res);
         return null;
     }
  };

  const initResetPassword = async (data) => {
    const fd = new FormData();
    fd.append('email', data['email']);
    const res = await executeRequest(methods.POST, "/reset/password/", fd);
    switch (res.status) {
      case 200:
      case 400:
        return res;
      default:
        handleError(res);
        return null;
    }
  };

  const checkResetPasswordToken = async (token) => {
    const res = await executeRequest(methods.GET, "/reset/" + token + "/");
    switch (res.status) {
      case 200:
      case 403:
      case 410:
        return res;
      default:
        handleError(res);
        return null;
    }
  };

  const resetPassword = async (token, data) => {
    const fd = new FormData();
    fd.append('password', data['password']);
    const res = await executeRequest(methods.POST, "/reset/" + token + "/", fd);
    switch (res.status) {
      case 200:
        props.history.push(routes.SIGN_IN.url);
        return res;
      default:
        handleError(res);
        return null;
    }
  };

  const setUsername = (username) => {
    Cookies.set('username', username);
    setSession({...session, username: username});
  };

  const setUserPicture = (userPicture) => {
    Cookies.set('userPicture', userPicture);
    setSession({...session, userPicture: userPicture});
  };

  const handleError = (error) => {

    const fatalError = () => {
      clearSession();
      props.history.push(routes.HOME.url);
    };

    switch (error.status) {
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

  return (
    <AuthContext.Provider value={{
      ...session,
      clearSession,
      signIn,
      signInWithPlex,
      signOut,
      signUp,
      confirmEmail,
      resendConfirmation,
      initResetPassword,
      checkResetPasswordToken,
      resetPassword,
      setUsername,
      setUserPicture,
      handleError
    }}>
      { props.children }
    </AuthContext.Provider>
  )
};

const AuthContextWithRouterProvider = withRouter(AuthContextProvider);

export {
  AuthContext,
  AuthContextWithRouterProvider
};