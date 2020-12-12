import { ProviderTypes } from "../enums/ProviderTypes";
import { IProviderConfigBase } from "./IProviderConfigBase";

export interface ISonarrConfig extends IProviderConfigBase {
  readonly id: string;
  readonly name: string;
  readonly enabled: boolean;
  readonly providerType: ProviderTypes;
  readonly rootFolder: string;
  readonly animeRootFolder: string | null;
  readonly qualityProfileId: number;
  readonly animeQualityProfileId: string | null;
  readonly languageProfileId: number | null;
  readonly animeLanguageProfileId: number | null;
  readonly version: number;
}
