import { IQualityProfile } from "./IQualityProfile";

interface ILanguageProfile {
  readonly id: number;
  readonly name: string;
}

export interface ISonarrInstanceInfo {
  readonly rootFolders: string[];
  readonly qualityProfiles: IQualityProfile[];
  readonly languageProfiles: ILanguageProfile[];
  readonly version: number;
}
