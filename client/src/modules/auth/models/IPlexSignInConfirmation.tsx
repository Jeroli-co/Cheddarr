import { IDecodedToken } from "./IDecodedToken";

export interface IPlexSignInConfirmation {
  readonly decodedToken: IDecodedToken;
  readonly redirectURI: string;
}
