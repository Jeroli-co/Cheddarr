export interface ISession {
  isAuthenticated: boolean;
  username: string;
  readonly avatar: string;
  readonly admin: boolean;
  isLoading: boolean;
}

export const SessionDefaultImpl: ISession = {
  isAuthenticated: false,
  username: "",
  avatar: "",
  admin: false,
  isLoading: true,
};
