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
import { IUser } from "../models/IUser";

interface IAuthenticationContextInterface {
  readonly signUp: (
    data: ISignUpFormData
  ) => Promise<IAsyncCall<IUser> | IAsyncCall<null>>;
  readonly signIn: (
    data: ISignInFormData,
    redirectURI?: string
  ) => Promise<IAsyncCall | IAsyncCall<null>>;
}

const AuthenticationContextDefaultImpl: IAuthenticationContextInterface = {
  signUp(_: ISignUpFormData): Promise<IAsyncCall<IUser> | IAsyncCall<null>> {
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
    return await post<IUser>(APIRoutes.SIGN_UP, data).then((res) => {
      if (res.status === 201) {
        pushSuccess("Account created");
      }
      return res;
    });
  };

  const signIn = (data: ISignInFormData, redirectURI?: string) => {
    const fd = new FormData();
    fd.append("username", data.username);
    fd.append("password", data.password);
    return post<IEncodedToken>(APIRoutes.SIGN_IN, fd).then((res) => {
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
      return res;
    });
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
