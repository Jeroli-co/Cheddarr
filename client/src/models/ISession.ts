export interface ISession {
  isAuthenticated: boolean;
  username: string;
  readonly avatar: string;
  readonly admin: boolean;
  plex: boolean;
  isLoading: boolean;
}
