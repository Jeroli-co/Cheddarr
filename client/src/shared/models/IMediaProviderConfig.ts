import { IProviderSettingsBase } from "./IProviderSettingsBase";
import { ProviderTypes } from "../enums/ProviderTypes";

export interface IMediaProviderConfig extends IProviderSettingsBase {
  id: string;
  name: string;
  enabled: boolean;
  isDefault: boolean;
  providerType: ProviderTypes;
  rootFolder: string;
  qualityProfileId: number;
  version: number;
}
