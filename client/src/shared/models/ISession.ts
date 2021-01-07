export interface ISession {
  isAuthenticated: boolean;
  username: string;
  readonly avatar: string;
  readonly admin: boolean;
  plex: boolean;
  isLoading: boolean;
}

export const SessionDefaultImpl: ISession = {
  isAuthenticated: false,
  plex: false,
  username: "",
  avatar: "",
  admin: false,
  isLoading: true,
};
