import React, { createContext, useContext } from "react";
import { ISignInFormData } from "../models/ISignInFormData";
import { ISignUpFormData } from "../models/ISignUpFormData";
import { useHistory } from "react-router";
import { routes } from "../../router/routes";
import { useAPI } from "../../shared/hooks/useAPI";
import { useSession } from "../../shared/contexts/SessionContext";
import { IEncodedToken } from "../../shared/models/IEncodedToken";
import { useAlert } from "../../shared/contexts/AlertContext";
import { IUser } from "../../logged-in-app/pages/user-profile/models/IUser";
import { MESSAGES } from "../../shared/enums/Messages";
import { ERRORS_MESSAGE } from "../../shared/enums/ErrorsMessage";
import { instance } from "../../axiosInstance";
import { DefaultAsyncCall, IAsyncCall } from "../../shared/models/IAsyncCall";
import { APIRoutes } from "../../shared/enums/APIRoutes";

interface IAuthenticationContextInterface {
  readonly signUp: (
    data: ISignUpFormData
  ) => Promise<IAsyncCall<IUser> | IAsyncCall<null>>;
  readonly confirmEmail: (token: string) => void;
  readonly resendEmailConfirmation: (email: string) => void;
  readonly signIn: (data: ISignInFormData, redirectURI?: string) => void;
  readonly signInWithPlex: (redirectURI?: string) => void;
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

export default function AuthenticationContextProvider(props: any) {
  const history = useHistory();
  const { get, post, patch } = useAPI();
  const { initSession } = useSession();
  const { pushSuccess, pushDanger } = useAlert();

  const signUp = async (data: ISignUpFormData) => {
    return await post<IUser>(APIRoutes.SIGN_UP, data).then((res) => {
      if (res.data) {
        pushSuccess("Account created");
      }
      return res;
    });
  };

  const confirmEmail = (token: string) => {
    get(APIRoutes.CONFIRM_EMAIL(token)).then((res) => {
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
    patch(APIRoutes.SIGN_UP, { email: email }).then((res) => {
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
    post<IEncodedToken>(APIRoutes.SIGN_IN, fd).then((res) => {
      if (res.data && res.status === 200) {
        initSession(res.data);
        if (redirectURI) {
          history.push(redirectURI);
        }
      } else if (res.status === 401) {
        pushDanger("Wrong credentials");
      } else {
        pushDanger(ERRORS_MESSAGE.UNHANDLED_STATUS(res.status));
      }
    });
  };

  const signInWithPlex = (redirectURI?: string) => {
    get<string>(APIRoutes.INIT_PLEX_SIGN_IN).then((res1) => {
      if (res1.data) {
        instance
          .post<{ id: string; code: string }>(res1.data, {
            headers: { Accept: "application/json" },
          })
          .then(
            (res2) => {
              instance
                .post(APIRoutes.AUTHORIZE_PLEX_SIGN_IN, {
                  key: res2.data.id,
                  code: res2.data.code,
                  redirect_uri: redirectURI ? redirectURI : "",
                })
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
}

export const useAuthentication = () => useContext(AuthenticationContext);
