import React, {createContext, useEffect, useState} from 'react';
import axios from 'axios';
import {withRouter} from 'react-router';
import {PageLoader} from "../component/element/page-loader/PageLoader";
import {routes} from "../routes";
import Cookies from 'js-cookie'

export const AuthContext = createContext();

const initialSessionState = {
  username: null,
  userPicture: null,
  isAuthenticated: false
};

const AuthContextProvider = (props) => {

  const [isLoading, setIsLoading] = useState(false);
  const [session, setSession] = useState(initialSessionState);

  useEffect(() => {

    const loadSession = () => {
      const authenticated = Cookies.get('authenticated');
      const username = Cookies.get('username');
      const userPicture = Cookies.get('userPicture');
      if (authenticated === 'yes' && username && userPicture) {
        setSession({username: username, userPicture: userPicture, isAuthenticated: true});
      }
    };

    loadSession();
  }, []);

  const clearSession = () => {
    setSession(initialSessionState);
    Cookies.remove('authenticated');
    Cookies.remove('username');
    Cookies.remove('userPicture');
  };

  const handleError = (error, codesHandle = []) => {
    console.log(error);
    if (error.response) {
      const status = error.response.status;
      if (!codesHandle.includes(status)) {
        if (status === 500) {
          props.history.push(routes.INTERNAL_SERVER_ERROR.url);
        } else if (status === 404) {
          props.history.push(routes.NOT_FOUND.url);
        } else {
          clearSession();
          props.history.push(routes.HOME.url);
        }
      }
    }
  };

  const signIn = async (data, codesHandle = []) => {

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
        console.log(remember);
        fd.append('remember', remember);
      }
      return await axios.post('/api/sign-in', fd);
    };

    const initSession = (username, userPicture) => {
      setSession({username: username, userPicture: userPicture, isAuthenticated: true});
      Cookies.set('authenticated', 'yes', { expires: 365 });
      Cookies.set('username', username, { expires: 365 });
      Cookies.set('userPicture', userPicture, { expires: 365 });
    };

    setIsLoading(true);

    try {
      const res = data ? await post(data) : await get();
      initSession(res.data.username, res.data['user_picture']);
      return res.status;
    } catch (e) {
      handleError(e, codesHandle);
      return e.response ? e.response.status : 500;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('/api/sign-out');
      props.history.push(routes.SIGN_IN.url);
      return res.status;
    } catch (e) {
      return e.response ? e.response.status : 500;
    } finally {
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
      const email = res.data.username;
      // TODO: Confirm this MF email
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