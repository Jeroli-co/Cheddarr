import { ProviderTypes } from "../enums/ProviderTypes";
import { IProviderSettingsBase } from "./IProviderSettingsBase";

export interface ISonarrConfig extends IProviderSettingsBase {
  readonly id: string;
  readonly name: string;
  readonly enabled: boolean;
  readonly isDefault: boolean;
  readonly providerType: ProviderTypes;
  readonly rootFolder: string;
  readonly animeRootFolder: string | null;
  readonly qualityProfileId: number;
  readonly animeQualityProfileId: string | null;
  readonly version: number;
  readonly tags: number[];
}
