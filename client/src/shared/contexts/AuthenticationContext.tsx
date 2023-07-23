import React, { createContext, useContext } from "react";
import { ISignInFormData } from "../models/ISignInFormData";
import { ISignUpFormData } from "../models/ISignUpFormData";
import { useHistory } from "react-router";
import { useAPI } from "../hooks/useAPI";
import { useSession } from "./SessionContext";
import { IEncodedToken } from "../models/IEncodedToken";
import { useAlert } from "./AlertContext";
import { ERRORS_MESSAGE } from "../enums/ErrorsMessage";
import { DefaultAsyncCall, IAsyncCall } from "../models/IAsyncCall";
import { APIRoutes } from "../enums/APIRoutes";

interface IAuthenticationContextInterface {
  readonly signUp: (
    data: ISignUpFormData
  ) => Promise<IAsyncCall | IAsyncCall<null>>;
  readonly signIn: (
    data: ISignInFormData,
    redirectURI?: string
  ) => Promise<IAsyncCall | IAsyncCall<null>>;
}

const AuthenticationContextDefaultImpl: IAuthenticationContextInterface = {
  signUp(_: ISignUpFormData): Promise<IAsyncCall | IAsyncCall<null>> {
    return Promise.resolve(DefaultAsyncCall);
  },
  signIn(): Promise<IAsyncCall | IAsyncCall<null>> {
    return Promise.resolve(DefaultAsyncCall);
  },
};

const AuthenticationContext = createContext<IAuthenticationContextInterface>(
  AuthenticationContextDefaultImpl
);

export default function AuthenticationContextProvider(props: any) {
  const history = useHistory();
  const { post } = useAPI();
  const { initSession } = useSession();
  const { pushSuccess, pushDanger } = useAlert();

  const signUp = async (data: ISignUpFormData) => {
    const res = await post<IEncodedToken>(APIRoutes.SIGN_UP, data);
    if (res.status === 201) {
      pushSuccess("Account created");
      history.push("/");
      if (res.data) {
        initSession(res.data);
      }
    }
    return res;
  };

  const signIn = async (data: ISignInFormData, redirectURI?: string) => {
    const res = await post<IEncodedToken>(APIRoutes.SIGN_IN, data);
    if (res.data && res.status === 200) {
      initSession(res.data);
      if (redirectURI) {
        history.push(redirectURI);
      }
    } else if (res.status === 401) {
      pushDanger("Wrong credentials");
    } else if (res.status === 400) {
      pushDanger("Account needs to be confirmed");
    } else {
      pushDanger(ERRORS_MESSAGE.UNHANDLED_STATUS(res.status));
    }
    return res;
  };

  return (
    <AuthenticationContext.Provider
      value={{
        signUp,
        signIn,
      }}
    >
      {props.children}
    </AuthenticationContext.Provider>
  );
}

export const useAuthentication = () => useContext(AuthenticationContext);
