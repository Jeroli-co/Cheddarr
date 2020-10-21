import React, { createContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { routes } from "../../../router/routes";
import { AuthService } from "../services/AuthService";
import { useLocation } from "react-router";
import { DecodedTokenModel } from "../models/DecodedTokenModel";
import { PlexSignInConfirmationModel } from "../models/PlexSignInConfirmationModel";

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
        (plexSignInConfirmationModel) => {
          if (
            plexSignInConfirmationModel instanceof PlexSignInConfirmationModel
          ) {
            initSession(
              plexSignInConfirmationModel.decodedToken.username,
              plexSignInConfirmationModel.decodedToken.avatar,
              plexSignInConfirmationModel.decodedToken.admin
            );
            history.push(plexSignInConfirmationModel.redirectURI);
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
    const httpServiceResponseModel = await AuthService.signUp(data);
    const user = httpServiceResponseModel.data;
    if (user) {
      if (user.confirmed) {
        history.push(routes.SIGN_IN.url);
      }
    }
    return httpServiceResponseModel;
  };

  const signIn = async (data, redirectURI) => {
    const decodedToken = await AuthService.signIn(data);
    if (decodedToken instanceof DecodedTokenModel) {
      initSession(
        decodedToken.username,
        decodedToken.avatar,
        decodedToken.admin
      );
      history.push(redirectURI);
      return null;
    }
    return decodedToken;
  };

  const signInWithPlex = async (redirectURI) => {
    AuthService.signInWithPlex(redirectURI).then(() => null);
  };

  const confirmEmail = async (token) => {
    return await AuthService.confirmEmail(token);
  };

  const resendConfirmation = async (email) => {
    return await AuthService.resendConfirmation(email);
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
