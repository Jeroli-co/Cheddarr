export interface IDecodedToken {
  readonly id: string;
  readonly username: string;
  readonly avatar: string;
  readonly admin: boolean;
  readonly plex: boolean;
  readonly exp: number;
}
