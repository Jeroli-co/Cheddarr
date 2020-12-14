import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { useHistory } from "react-router-dom";
import { routes } from "../../router/routes";
import { AuthService } from "../../services/AuthService";
import { AuthContext, SessionDefaultImpl } from "./AuthContext";
import { ISignUpFormData } from "../../models/ISignUpFormData";
import { ISignInFormData } from "../../models/ISignInFormData";
import { UserService } from "../../services/UserService";

export const AuthContextProvider = (props: any) => {
  const [session, setSession] = useState({
    ...SessionDefaultImpl,
    isLoading: true,
  });

  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    if (location.pathname === routes.CONFIRM_PLEX_SIGNIN.url) {
      AuthService.confirmSignInWithPlex(location.search).then(
        (response) => {
          const plexSignInData = response.data;
          if (plexSignInData) {
            initSession(
              plexSignInData.decodedToken.username,
              plexSignInData.decodedToken.avatar,
              plexSignInData.decodedToken.admin,
              plexSignInData.decodedToken.plex
            );
            history.push(plexSignInData.redirectURI);
          }
        },
        () => invalidSession()
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (session.isLoading) {
      const currentSession = AuthService.getCurrentSession();
      if (currentSession) {
        const { admin, avatar, username, plex } = currentSession;
        initSession(username, avatar, admin, plex);
      } else {
        clearSession();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  const initSession = (
    username: string,
    avatar: string,
    admin: boolean,
    plex: boolean
  ) => {
    setSession({
      isAuthenticated: true,
      username: username,
      avatar: avatar,
      admin: admin,
      plex: plex,
      isLoading: false,
    });
  };

  const invalidSession = () => {
    AuthService.deleteToken();
    clearSession();
    history.push(routes.SIGN_IN.url);
  };

  const clearSession = () => {
    setSession({ ...SessionDefaultImpl });
  };

  const signUp = async (data: ISignUpFormData) => {
    const response = await AuthService.signUp(data);
    const user = response.data;
    if (user && user.confirmed) {
      history.push(routes.SIGN_IN.url);
    }
    return response;
  };

  const signIn = async (data: ISignInFormData, redirectURI: string) => {
    const response = await AuthService.signIn(data);
    const decodedToken = response.data;
    if (decodedToken) {
      initSession(
        decodedToken.username,
        decodedToken.avatar,
        decodedToken.admin,
        decodedToken.plex
      );
      history.push(redirectURI);
    }
    return response;
  };

  const updateUsername = (username: string) => {
    return UserService.ChangeUsername(username).then((response) => {
      if (response.error === null) {
        const user = response.data;
        if (user) {
          AuthService.changeUsername(user.username);
          setSession({ ...session, username: user.username });
        }
      }
      return response;
    });
  };

  const unlinkPlexAccount = () => {
    return UserService.UnlinkPlexAccount().then((response) => {
      if (response.error === null) {
        AuthService.unlinkPlexAccount();
        setSession({ ...session, plex: false });
      }
      return response;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        session: session,
        signIn: signIn,
        signUp: signUp,
        invalidSession: invalidSession,
        updateUsername: updateUsername,
        unlinkPlexAccount,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
