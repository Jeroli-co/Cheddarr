import { Roles } from "../enums/Roles";

export interface IDecodedToken {
  readonly id: string;
  readonly exp: number;
  readonly username: string;
  readonly avatar: string;
  readonly roles: Roles;
}
