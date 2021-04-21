import { Roles } from "../enums/Roles";

export interface ISession {
  isAuthenticated: boolean;
  username: string;
  avatar: string;
  roles: Roles;
  isLoading: boolean;
}

export const SessionDefaultImpl: ISession = {
  isAuthenticated: false,
  username: "",
  avatar: "",
  roles: Roles.NONE,
  isLoading: true,
};
