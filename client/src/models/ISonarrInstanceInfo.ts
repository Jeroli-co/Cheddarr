import { ILanguageProfile } from "./ILanguageProfile";
import { IQualityProfile } from "./IQualityProfile";

export interface ISonarrInstanceInfo {
  readonly rootFolders: string[];
  readonly qualityProfiles: IQualityProfile[];
  readonly languageProfiles: ILanguageProfile[];
  readonly version: number;
}
