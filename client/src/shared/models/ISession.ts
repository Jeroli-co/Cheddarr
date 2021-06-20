import { IUser } from "./IUser";

export interface ISession {
  isAuthenticated: boolean;
  user: IUser | null;
  isLoading: boolean;
}

export const SessionDefaultImpl: ISession = {
  isAuthenticated: false,
  user: null,
  isLoading: true,
};
