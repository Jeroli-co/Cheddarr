export interface IUser {
  readonly username: string;
  readonly email: string;
  readonly avatar: string;
  readonly confirmed: boolean;
  readonly admin: boolean;
}
