export interface ISession {
  isAuthenticated: boolean;
  username: string;
  readonly avatar: string;
  readonly admin: boolean;
  isLoading: boolean;
}
