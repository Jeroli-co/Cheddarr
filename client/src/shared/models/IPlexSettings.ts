import {ProviderTypes} from "../enums/ProviderTypes";
import {IProviderSettingsBase} from "./IProviderSettingsBase";

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
  libraryId: number;
  name: string;
  enabled: boolean;
}
