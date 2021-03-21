import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import { ISession, SessionDefaultImpl } from "../models/ISession";
import { IEncodedToken } from "../models/IEncodedToken";
import { IDecodedToken } from "../models/IDecodedToken";
import { routes } from "../../router/routes";
import { instance } from "../../axiosInstance";
import { APIRoutes } from "../enums/APIRoutes";
import { ERRORS_MESSAGE } from "../enums/ErrorsMessage";
import { useLocation } from "react-router-dom";
import { useHistory } from "react-router";
import { useAlert } from "./AlertContext";

interface ISessionContextInterface {
  session: ISession;
  readonly updateUsername: (username: string) => void;
  readonly initSession: (encodedToken: IEncodedToken) => void;
  readonly invalidSession: () => void;
}

const SessionContextDefaultImpl: ISessionContextInterface = {
  session: SessionDefaultImpl,
  invalidSession(): void {},
  initSession(): void {},
  updateUsername(): void {},
};

const SessionContext = createContext<ISessionContextInterface>(
  SessionContextDefaultImpl
);

export const SessionContextProvider = (props: any) => {
  const [session, setSession] = useState(SessionDefaultImpl);
  const location = useLocation();
  const history = useHistory();
  const { pushDanger } = useAlert();

  useEffect(() => {
    if (session.isLoading) {
      if (location.pathname === routes.CONFIRM_PLEX_SIGNIN.url) {
        instance
          .get<IEncodedToken>(APIRoutes.CONFIRM_PLEX_SIGN_IN(location.search))
          .then(
            (res) => {
              initSession(res.data);
              let redirectURI = res.headers["redirect-uri"];
              if (redirectURI && redirectURI.length > 0) {
                history.push(redirectURI);
              }
            },
            (error) => {
              if (error.status) {
                pushDanger(ERRORS_MESSAGE.UNHANDLED_STATUS(error.status));
              }
            }
          );
      } else {
        const encodedSession = getEncodedSession();
        if (encodedSession) {
          initSession(encodedSession);
        } else {
          invalidSession();
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.isLoading]);

  const getEncodedSession = (): IEncodedToken | null => {
    const tokenType = Cookies.get("token_type");
    const accessToken = Cookies.get("access_token");
    if (tokenType !== undefined && accessToken !== undefined) {
      return {
        access_token: accessToken,
        token_type: tokenType,
      };
    } else {
      return null;
    }
  };

  const initSession = (encodedToken: IEncodedToken) => {
    Cookies.set("token_type", encodedToken.token_type);
    Cookies.set("access_token", encodedToken.access_token);
    const decodedToken = jwt_decode<IDecodedToken>(encodedToken.access_token);
    setSession({
      isAuthenticated: true,
      username: decodedToken.username,
      avatar: decodedToken.avatar,
      admin: decodedToken.admin,
      isLoading: false,
    });
  };

  const invalidSession = () => {
    Cookies.remove("token_type");
    Cookies.remove("access_token");
    setSession({
      ...SessionDefaultImpl,
      isLoading: false,
    });
  };

  const updateUsername = (username: string) => {
    setSession({ ...session, username: username });
  };

  return (
    <SessionContext.Provider
      value={{
        session,
        initSession,
        invalidSession,
        updateUsername,
      }}
    >
      {props.children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);
