import { IQualityProfile } from "./IQualityProfile";
import { ITag } from "./ITag";

export interface IRadarrInstanceInfo {
  readonly rootFolders: string[];
  readonly qualityProfiles: IQualityProfile[];
  readonly tags: ITag[];
}
