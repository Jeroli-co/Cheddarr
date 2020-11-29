import { IRadarrConfig } from "./IRadarrConfig";

export interface ISonarrConfig extends IRadarrConfig {
  readonly animeRootFolder: string;
  readonly animeQualityProfileId: number;
  readonly languageProfileId: number;
  readonly animeLanguageProfileId: number;
}
