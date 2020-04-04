import React, {createContext, useContext, useEffect, useState} from 'react';
import {withRouter} from 'react-router';
import {routes} from "../router/routes";
import Cookies from 'js-cookie'
import {APIContext, methods} from "./APIContext";
import {PageLoader} from "../elements/PageLoader";
import {NotificationContext} from "./NotificationContext";

const AuthContext = createContext();

const initialSessionState = {
  isAuthenticated: false,
  username: null,
  userPicture: null,
};

const AuthContextProvider = (props) => {

  const [session, setSession] = useState(initialSessionState);
  const [apiKey, setApiKey] = useState("");
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const { executeRequest } = useContext(APIContext);
  const { pushSuccess } = useContext(NotificationContext);

  const profileURI = '/profile/';

  useEffect(() => {
    // Load session from browser storage
    const authenticated = Cookies.get('authenticated');
    const username = Cookies.get('username');
    const userPicture = Cookies.get('userPicture');
    if (authenticated === 'yes') {
      setSession({isAuthenticated: true, username: username, userPicture: userPicture})
    } else {
      setIsLoadingSession(false);
    }
  }, []);

  useEffect(() => {
    if (session.isAuthenticated) {
      setIsLoadingSession(false);
      getApiKey().then(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.isAuthenticated]);

  const initSession = (username, userPicture) => {
    Cookies.set('authenticated', 'yes', { expires: 365 });
    Cookies.set('username', username, { expires: 365 });
    Cookies.set('userPicture', userPicture, { expires: 365 });
    setSession({username: username, userPicture: userPicture, isAuthenticated: true});
  };

  const clearSession = () => {
    Cookies.remove('authenticated');
    Cookies.remove('username');
    Cookies.remove('userPicture');
    setSession(initialSessionState);
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

  const signIn = async (data) => {

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
        return res;
      case 400:
      case 401:
        return res;
      default:
        handleError(res);
        return null;
    }
  };

  const signInWithPlex = async (redirectURI = null) => {
    const uri = redirectURI ? redirectURI : "";
    const res = await executeRequest(methods.GET, "/sign-in/plex/?redirectURI=" + uri);
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

  const getApiKey = async () => {
    const res = await executeRequest(methods.GET, "/key/cheddarr/");
    switch (res.status) {
      case 200:
        const key = res.data["key"] ? res.data["key"] : null;
        if (key) setApiKey(key);
        return res;
      default:
        handleError(res);
        return null;
    }
  };

  const resetApiKey = async () => {
    const res = await executeRequest(methods.GET, "/key/cheddarr/reset/");
    switch (res.status) {
      case 200:
        setApiKey(res.data["key"]);
        return res;
      default:
        handleError(res);
        return null;
    }
  };

  const deleteApiKey = async () => {
    const res = await executeRequest(methods.DELETE, "/key/cheddarr/");
    switch (res.status) {
      case 200:
        setApiKey("");
        return res;
      default:
        handleError(res);
        return null;
    }
  };

  const changePassword = async (data) => {
    const fd = new FormData();
    fd.append('oldPassword', data['oldPassword']);
    fd.append('newPassword', data['newPassword']);
    const res = await executeRequest(methods.PUT, profileURI + "password/", fd);
    switch (res.status) {
      case 200:
        clearSession();
        return res;
      case 400:
        return res;
      default:
        handleError(res);
        return null;
    }
  };

  const deleteAccount = async (data) => {
    const fd = new FormData();
    fd.append('password', data['password']);
    const res = await executeRequest(methods.DELETE, profileURI, fd);
    switch (res.status) {
      case 200:
        clearSession();
        return res;
      case 400:
        return res;
      default:
        handleError(res);
        return null;
    }
  };

  const getUser = async () => {
    const res = await executeRequest(methods.GET, profileURI);
    switch (res.status) {
      case 200:
        return res;
      default:
        handleError(res);
        return null;
    }
  };

  const getFriend = async (username) => {
    const res = await executeRequest(methods.GET, "/profile/friends/" + username + "/");
    switch (res.status) {
      case 200:
        return res;
      default:
        handleError(res);
        return null;
    }
  };

  const changeEmail = async (data) => {
    const fd = new FormData();
    fd.append('email', data['email']);
    const res = await executeRequest(methods.PUT, profileURI + 'email/', fd);
    switch (res.status) {
      case 200:
      case 409:
        return res;
      default:
        handleError(res);
        return null;
    }
  };

  const changeUsername = async (data) => {
    const fd = new FormData();
    fd.append('username', data['newUsername']);
    const res = await executeRequest(methods.PUT, profileURI + "username/", fd);
    switch (res.status) {
      case 200:
        const username = res.data.username;
        Cookies.set('username', username);
        setSession({...session, username: username});
        pushSuccess("Username has changed");
        return res;
      case 409:
        return res;
      default:
        handleError(res);
        return null;
    }
  };

  const changeUserPicture = async (data) => {
    const fd = new FormData();
    fd.append('picture', data);
    const res = await executeRequest(methods.PUT, profileURI + "picture/", fd, { 'content-type': 'multipart/form-data' });
    switch (res.status) {
      case 200:
        const userPicture = res.data["user_picture"];
        Cookies.set('userPicture', userPicture);
        setSession({...session, userPicture: userPicture});
        pushSuccess("Picture has changed");
        return res;
      default:
        handleError(res);
        return null;
    }
  };

  const getPlexConfig = async () => {
    const res = await executeRequest(methods.GET, "/provider/plex/config/");
    switch (res.status) {
      case 200:
        return res;
      default:
        handleError(res);
        return null;
    }
  };

  const getPlexServer = async () => {
    const res = await executeRequest(methods.GET, "/provider/plex/servers/");
    switch (res.status) {
      case 200:
        return res;
      default:
        handleError(res);
        return null;
    }
  };

  return (
    <AuthContext.Provider value={{
      ...session,
      apiKey,
      isLoadingSession,
      handleError,
      signIn,
      signInWithPlex,
      authorizePlex,
      signOut,
      signUp,
      confirmEmail,
      resendConfirmation,
      initResetPassword,
      checkResetPasswordToken,
      resetPassword,
      changePassword,
      getUser,
      getFriend,
      changeEmail,
      changeUsername,
      changeUserPicture,
      getApiKey,
      resetApiKey,
      deleteApiKey,
      deleteAccount,
      getPlexConfig,
      getPlexServer
    }}>
      { isLoadingSession && <PageLoader/> }
      { props.children }
    </AuthContext.Provider>
  )
};

const AuthContextWithRouterProvider = withRouter(AuthContextProvider);

export {
  AuthContext,
  AuthContextWithRouterProvider
};