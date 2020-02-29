import React, {createContext, useEffect, useState} from 'react';
import axios from 'axios';
import {withRouter} from 'react-router';

export const AuthContext = createContext();

const AuthContextProvider = (props) => {

  const initialSessionState = () => {
    const username = localStorage.getItem('username') || null;
    const expiresAt = localStorage.getItem('expiresAt') || null;
    return {
      username: username,
      expiresAt: expiresAt,
      isAuthenticated: !!username && !!expiresAt,
      isFresh: false,
      isLoading: false
    };
  };

  const [session, setSession] = useState(initialSessionState());

  useEffect(() => {

    const refreshSession = async () => {
      const res = await axios.get('/api/refresh-session');
      const username = res.data.username;
      const expiresAt = res.data.expiresAt;
      if (username && expiresAt) {
        updateSession(username, expiresAt);
      } else {
        throw new Error("Response data doesn't match the wanted model");
      }
    };

    if (session.expiresAt && ((new Date().getTime() > session.expiresAt) || !session.isFresh)) {
      refreshSession()
        .then(() => {
          console.log("Session refreshed")
        })
        .catch((e) => {
          handleError(e);
        });
    }

  }, []);

  const signUp = async (data) => {
    const fd = new FormData();
    fd.append('firstName', data['firstName']);
    fd.append('lastName', data['lastName']);
    fd.append('username', data['username']);
    fd.append('email', data['email']);
    fd.append('password', data['password']);

    try {
      setSession({isLoading: true});
      await axios.post('/api/sign-up', fd);
      props.history.push('/confirm/account');
    } catch (e) {
      handleError(e);
    } finally {
      setSession({isLoading: false});
    }
  };

  const signIn = async (data) => {
    const fd = new FormData();
    fd.append('usernameOrEmail', data['usernameOrEmail']);
    fd.append('password', data['password']);
    fd.append('remember', data['remember']);
    try {
      setSession({isLoading: true});
      const res = await axios.post('/api/sign-in', fd);
      updateSession(res.data.username, res.data.expiresAt);
    } catch (e) {
      handleError(e);
    } finally {
      setSession({isLoading: false});
    }
  };

  const signOut = async () => {
    try {
      await axios.get('/api/sign-out');
      clearSession();
    } catch (e) {
      handleError(e);
    } finally {
      props.history.push('/');
    }
  };

  const handleError = (error) => {
    console.log(error);
    clearSession();
  };

  const updateSession = (username, expiresAt) => {
    localStorage.setItem('username', username);
    localStorage.setItem('expiresAt', expiresAt);
    setSession({username: username, expiresAt: expiresAt, isAuthenticated: true, isFresh: true});
  };

  const clearSession = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('expiresAt');
    setSession(initialSessionState());
  };

  return (
    <AuthContext.Provider value={{...session, signUp, signIn, signOut}}>
      {props.children}
    </AuthContext.Provider>
  )
};

export default withRouter(AuthContextProvider);