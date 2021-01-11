import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import { ISession, SessionDefaultImpl } from "../models/ISession";
import { IEncodedToken } from "../models/IEncodedToken";
import { IDecodedToken } from "../models/IDecodedToken";
import { routes } from "../../routes";

interface ISessionContextInterface {
  session: ISession;
  readonly updateUsername: (username: string) => void;
  readonly unlinkPlexAccount: () => void;
  readonly initSession: (
    encodedToken: IEncodedToken,
    redirectURI?: string
  ) => void;
  readonly invalidSession: (redirectURI?: string) => void;
}

const SessionContextDefaultImpl: ISessionContextInterface = {
  session: SessionDefaultImpl,
  invalidSession(): void {},
  initSession(): void {},
  unlinkPlexAccount(): void {},
  updateUsername(): void {},
};

const SessionContext = createContext<ISessionContextInterface>(
  SessionContextDefaultImpl
);

export const SessionContextProvider = (props: any) => {
  const [session, setSession] = useState(SessionDefaultImpl);

  useEffect(() => {
    if (session.isLoading) {
      const encodedSession = getEncodedSession();
      if (encodedSession) {
        initSession(encodedSession);
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

  const initSession = (encodedToken: IEncodedToken, redirectURI?: string) => {
    Cookies.set("token_type", encodedToken.token_type);
    Cookies.set("access_token", encodedToken.access_token);
    const decodedToken = jwt_decode<IDecodedToken>(encodedToken.access_token);
    setSession({
      isAuthenticated: true,
      username: decodedToken.username,
      avatar: decodedToken.avatar,
      admin: decodedToken.admin,
      plex: decodedToken.plex,
      isLoading: false,
    });
  };

  const invalidSession = (redirectURI?: string) => {
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

  const unlinkPlexAccount = () => {
    setSession({ ...session, plex: false });
  };

  return (
    <SessionContext.Provider
      value={{
        session: session,
        initSession: initSession,
        invalidSession: invalidSession,
        updateUsername: updateUsername,
        unlinkPlexAccount: unlinkPlexAccount,
      }}
    >
      {props.children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);
