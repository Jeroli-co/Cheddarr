import { createContext } from "react";
import { ISession } from "../models/ISession";
import {
  AsyncResponseSuccess,
  IAsyncResponse,
} from "../../api/models/IAsyncResponse";
import { ISignInFormData } from "../models/ISignInFormData";
import { ISignUpFormData } from "../models/ISignUpFormData";
import { IUser } from "../../user/models/IUser";
import { IDecodedToken } from "../models/IDecodedToken";

interface AuthContextInterface {
  session: ISession;

  readonly signIn: (
    data: ISignInFormData,
    redirectURL: string
  ) => Promise<IAsyncResponse<IDecodedToken | null>>;

  readonly signUp: (
    data: ISignUpFormData
  ) => Promise<IAsyncResponse<IUser | null>>;

  readonly updateUsername: (
    username: string
  ) => Promise<IAsyncResponse<IUser | null>>;

  readonly invalidSession: () => void;
}

export const SessionDefaultImpl: ISession = {
  isAuthenticated: false,
  username: "",
  avatar: "",
  admin: false,
  isLoading: false,
};

export const AuthContextDefaultImpl: AuthContextInterface = {
  session: SessionDefaultImpl,
  invalidSession(): void {},
  signIn(): Promise<IAsyncResponse<IDecodedToken>> {
    return Promise.resolve(new AsyncResponseSuccess(""));
  },
  signUp(): Promise<IAsyncResponse<IUser>> {
    return Promise.resolve(new AsyncResponseSuccess(""));
  },
  updateUsername(): Promise<IAsyncResponse<IUser>> {
    return Promise.resolve(new AsyncResponseSuccess(""));
  },
};

export const AuthContext = createContext<AuthContextInterface>(
  AuthContextDefaultImpl
);
