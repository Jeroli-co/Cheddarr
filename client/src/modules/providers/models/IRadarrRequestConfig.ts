import { IQualityProfile } from "./IQualityProfile";

export interface IRadarrRequestConfig {
  readonly rootFolders: string[];
  readonly qualityProfiles: IQualityProfile[];
}
