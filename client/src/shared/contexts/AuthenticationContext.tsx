import React, { createContext, useContext, useEffect } from "react";
import { ISignInFormData } from "../../logged-out-app/models/ISignInFormData";
import { ISignUpFormData } from "../../logged-out-app/models/ISignUpFormData";
import { useLocation } from "react-router-dom";
import { useHistory } from "react-router";
import { routes } from "../../routes";
import { useAPI } from "../hooks/useAPI";
import { useSession } from "./SessionContext";
import { IEncodedToken } from "../models/IEncodedToken";
import { useAlert } from "./AlertContext";
import { IUser } from "../../logged-in-app/pages/user-profile/models/IUser";
import axios from "axios";
import { MESSAGES } from "../enums/Messages";
import { ERRORS_MESSAGE } from "../enums/ErrorsMessage";
import { instance } from "../../axiosInstance";
import { DefaultAsyncCall, IAsyncCall } from "../models/IAsyncCall";

interface IAuthenticationContextInterface {
  readonly signUp: (
    data: ISignUpFormData
  ) => Promise<IAsyncCall<IUser> | IAsyncCall<null>>;
  readonly confirmEmail: (token: string) => void;
  readonly resendEmailConfirmation: (email: string) => void;
  readonly signIn: (data: ISignInFormData, redirectURI?: string) => void;
  readonly signInWithPlex: (redirectURI: string) => void;
}

const AuthenticationContextDefaultImpl: IAuthenticationContextInterface = {
  signUp(_: ISignUpFormData): Promise<IAsyncCall<IUser> | IAsyncCall<null>> {
    return Promise.resolve(DefaultAsyncCall);
  },
  confirmEmail(): void {},
  resendEmailConfirmation(): void {},
  signIn(): void {},
  signInWithPlex(): void {},
};

const AuthenticationContext = createContext<IAuthenticationContextInterface>(
  AuthenticationContextDefaultImpl
);

export const AuthenticationContextProvider = (props: any) => {
  const location = useLocation();
  const history = useHistory();
  const { get, post, patch } = useAPI();
  const { initSession } = useSession();
  const { pushSuccess, pushDanger } = useAlert();

  useEffect(() => {
    if (location.pathname === routes.CONFIRM_PLEX_SIGNIN.url) {
      instance
        .get<IEncodedToken>("/sign-in/plex/confirm/".concat(location.search))
        .then(
          (res) => {
            const redirectURI: string | null = res.headers["redirect-uri"];
            initSession(res.data);
            history.push(
              redirectURI && redirectURI.length > 0
                ? redirectURI
                : routes.HOME.url
            );
          },
          (error) => {
            if (error.status) {
              pushDanger(ERRORS_MESSAGE.UNHANDLED_STATUS(error.status));
            }
          }
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signUp = async (data: ISignUpFormData) => {
    return await post<IUser>("/sign-up", data).then((res) => {
      if (res.data) {
        pushSuccess("Account created");
      }
      return res;
    });
  };

  const confirmEmail = (token: string) => {
    get("/sign-up/".concat(token)).then((res) => {
      if (res.status === 200) {
        pushSuccess(MESSAGES.EMAIL_CONFIRMED);
        history.push(routes.SIGN_IN.url());
      } else {
        pushDanger(ERRORS_MESSAGE.UNHANDLED_STATUS(res.status));
        history.push(routes.HOME.url);
      }
    });
  };

  const resendEmailConfirmation = (email: string) => {
    patch("/sign-up", { email: email }).then((res) => {
      if (res.status === 200) {
        pushSuccess(MESSAGES.EMAIL_CONFIRMATION_RESENT);
      } else {
        pushDanger(ERRORS_MESSAGE.UNHANDLED_STATUS(res.status));
      }
    });
  };

  const signIn = (data: ISignInFormData, redirectURI?: string) => {
    const fd = new FormData();
    fd.append("username", data.username);
    fd.append("password", data.password);
    post<IEncodedToken>("/sign-in", fd).then((res) => {
      if (res.data && res.status === 200) {
        initSession(res.data);
        history.push(redirectURI ? redirectURI : routes.HOME.url);
      } else if (res.status === 401) {
        pushDanger("Wrong credentials");
      }
    });
  };

  const signInWithPlex = async (redirectURI: string) => {
    get<string>("/sign-in/plex").then((res1) => {
      if (res1.data) {
        axios
          .post<{ id: string; code: string }>(res1.data, {
            headers: { Accept: "application/json" },
          })
          .then(
            (res2) => {
              axios
                .post("/sign-in/plex/authorize", {
                  key: res2.data.id,
                  code: res2.data.code,
                  redirectUri: redirectURI,
                })
                .then(
                  (res3) => {
                    window.location.href = res3.headers.location;
                  },
                  (error) => {
                    if (error.status) {
                      pushDanger(ERRORS_MESSAGE.UNHANDLED_STATUS(error.status));
                    }
                  }
                );
            },
            (error) => {
              if (error.status) {
                pushDanger(ERRORS_MESSAGE.UNHANDLED_STATUS(error.status));
              }
            }
          );
      }
    });
  };

  return (
    <AuthenticationContext.Provider
      value={{
        signUp: signUp,
        confirmEmail: confirmEmail,
        resendEmailConfirmation: resendEmailConfirmation,
        signIn: signIn,
        signInWithPlex: signInWithPlex,
      }}
    >
      {props.children}
    </AuthenticationContext.Provider>
  );
};

export const useAuthentication = () => useContext(AuthenticationContext);
