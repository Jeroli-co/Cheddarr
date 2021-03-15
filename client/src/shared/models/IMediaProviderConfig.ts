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

export interface IRadarrConfig extends IMediaProviderConfig {}

export interface ISonarrConfig extends IMediaProviderConfig {
  animeRootFolder: string | null;
  animeQualityProfileId: string | null;
  languageProfileId: number | null;
  animeLanguageProfileId: number | null;
  version: number;
}
