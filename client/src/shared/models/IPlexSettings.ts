import { ProviderTypes } from "../enums/ProviderTypes";
import { IProviderSettingsBase } from "./IProviderSettingsBase";
import { MediaTypes } from "../enums/MediaTypes";

export interface IPlexSettings extends IProviderSettingsBase {
  id: string;
  name: string;
  enabled: boolean;
  providerType: ProviderTypes;
  serverName: string;
  serverId: string;
  librarySections: IPlexLibraries[];
}

export interface IPlexLibraries {
  id: number;
  name: string;
  type: MediaTypes;
  enabled: boolean;
}
