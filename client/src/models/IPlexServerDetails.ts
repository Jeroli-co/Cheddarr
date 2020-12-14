import { IPlexServerInfo } from "./IPlexServerInfo";

export interface IPlexServerDetails extends IPlexServerInfo {
  readonly host: string;
  readonly port: number;
  readonly ssl: boolean;
  readonly apiKey: string;
}
