import { IProviderSettingsBase } from "./IProviderSettingsBase";

export interface IMediaServerConfig extends IProviderSettingsBase {
  id: string;
  name: string;
  enabled: boolean;
  serverName: string;
  serverId: string;
  libraries: IMediaServerLibrary[];
}

export interface IMediaServerLibrary {
  libraryId: number;
  name: string;
  enabled: boolean;
}
