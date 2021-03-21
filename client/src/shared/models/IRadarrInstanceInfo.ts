import { IQualityProfile } from "./IQualityProfile";

export interface IRadarrInstanceInfo {
  readonly rootFolders: string[];
  readonly qualityProfiles: IQualityProfile[];
  readonly version: number;
}
