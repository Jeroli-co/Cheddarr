import React, { createContext, useContext } from "react";
import { APIRoutes } from "../enums/APIRoutes";
import { instance } from "../../axiosInstance";
import { ERRORS_MESSAGE } from "../enums/ErrorsMessage";
import { useAPI } from "../hooks/useAPI";
import { useAlert } from "./AlertContext";
import { useSession } from "./SessionContext";

interface IPlexAuthContextInterface {
  readonly signInWithPlex: (redirectURI?: string) => void;
}

const PlexAuthContextDefaultImpl: IPlexAuthContextInterface = {
  signInWithPlex(): void {},
};

const PlexAuthContext = createContext<IPlexAuthContextInterface>(
  PlexAuthContextDefaultImpl
);

export const usePlexAuth = () => useContext(PlexAuthContext);

export default function PlexAuthContextProvider(props: any) {
  const { get } = useAPI();
  const { pushDanger } = useAlert();
  const {
    session: { user },
  } = useSession();

  const signInWithPlex = (redirectURI?: string) => {
    get<string>(APIRoutes.INIT_PLEX_SIGN_IN).then((res1) => {
      if (res1.data) {
        instance
          .post<{ id: string; code: string }>(res1.data, {
            headers: {
              Accept: "application/json",
              "Cache-Control": "no-cache",
              Pragma: "no-cache",
              Expires: "0",
            },
          })
          .then(
            (res2) => {
              instance
                .post(
                  APIRoutes.AUTHORIZE_PLEX_SIGN_IN,
                  {
                    key: res2.data.id,
                    code: res2.data.code,
                    redirect_uri: redirectURI ?? "",
                    user_id: user?.id,
                  },
                  {
                    headers: {
                      "Cache-Control": "no-cache",
                      Pragma: "no-cache",
                      Expires: "0",
                    },
                  }
                )
                .then(
                  (res3) => {
                    window.location.href = res3.headers.location;
                  },
                  (error) => {
                    if (error.response && error.response.status) {
                      pushDanger(
                        ERRORS_MESSAGE.UNHANDLED_STATUS(error.response.status)
                      );
                    }
                  }
                );
            },
            (error) => {
              if (error.response && error.response.status) {
                pushDanger(
                  ERRORS_MESSAGE.UNHANDLED_STATUS(error.response.status)
                );
              }
            }
          );
      }
    });
  };

  return (
    <PlexAuthContext.Provider
      value={{
        signInWithPlex,
      }}
    >
      {props.children}
    </PlexAuthContext.Provider>
  );
}
