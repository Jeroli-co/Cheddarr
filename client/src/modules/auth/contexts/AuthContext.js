import React, { createContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { routes } from "../../../router/routes";
import { HTTP_METHODS } from "../../api/enums/HttpMethods";
import { HttpService } from "../../api/services/HttpService";
import { AuthService } from "../services/AuthService";
import { useLocation } from "react-router";
import { DecodedTokenModel } from "../models/DecodedTokenModel";
import { UserModel } from "../../user/models/UserModel";

const AuthContext = createContext();

const initialSessionState = {
  isAuthenticated: false,
  id: null,
  username: null,
  avatar: null,
  admin: false,
  isLoading: true,
};

const AuthContextProvider = (props) => {
  const [session, setSession] = useState(initialSessionState);

  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    if (location.pathname === routes.CONFIRM_PLEX_SIGNIN.url) {
      AuthService.confirmSignInWithPlex(location.search).then(
        (response) => {
          if (response) {
            const decodedToken = AuthService.saveToken(response.data);
            if (decodedToken instanceof DecodedTokenModel) {
              initSession(
                decodedToken.username,
                decodedToken.avatar,
                decodedToken.admin
              );
              let redirectURI = response.headers["redirect-uri"];
              redirectURI =
                redirectURI && redirectURI.length > 0
                  ? redirectURI
                  : routes.HOME.url;
              history.push(redirectURI);
            } else {
              throw new Error();
            }
          } else {
            throw new Error();
          }
        },
        () => invalidSession()
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (session.isLoading) {
      const current_session = AuthService.getCurrentSession();
      if (current_session) {
        initSession(
          current_session.username,
          current_session.avatar,
          current_session.admin
        );
      } else {
        clearSession();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  const initSession = (username, avatar, admin) => {
    setSession({
      isAuthenticated: true,
      username: username,
      avatar: avatar,
      admin: admin,
      isLoading: false,
    });
  };

  const clearSession = () => {
    setSession({ ...initialSessionState, isLoading: false });
  };

  const signUp = async (data) => {
    const user = await AuthService.signUp(data);
    if (user instanceof UserModel) {
      if (user.confirmed) {
        history.push(routes.SIGN_IN.url);
        return null;
      } else {
        return "";
      }
    }
    return user;
  };

  const signIn = async (data, redirectURI) => {
    const res = await AuthService.signIn(data);
    if (res instanceof DecodedTokenModel) {
      initSession(res.username, res.avatar, res.admin);
      history.push(redirectURI);
      return null;
    }
    return res;
  };

  const signInWithPlex = async (redirectURI) => {
    AuthService.signInWithPlex(redirectURI).then(() => null);
  };

  const confirmEmail = async (token) => {
    const res = await HttpService.executeRequest(
      HTTP_METHODS.GET,
      "/sign-up/" + token
    );
    switch (res.status) {
      case 200:
        return res;
      case 403:
      case 410:
        return res;
      default:
        return null;
    }
  };

  const resendConfirmation = async (email) => {
    const res = await HttpService.executeRequest(
      HTTP_METHODS.PATCH,
      "/sign-up",
      email
    );
    switch (res.status) {
      case 200:
      case 400:
        return res;
      default:
        return null;
    }
  };

  const invalidSession = () => {
    AuthService.deleteToken();
    clearSession();
    history.push(routes.SIGN_IN.url);
  };

  const updateUsername = (username) => {
    AuthService.changeUsername(username);
    setSession({ ...session, username: username });
  };

  return (
    <AuthContext.Provider
      value={{
        ...session,
        signIn,
        signInWithPlex,
        signUp,
        confirmEmail,
        resendConfirmation,
        invalidSession,
        updateUsername,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthContextProvider };
