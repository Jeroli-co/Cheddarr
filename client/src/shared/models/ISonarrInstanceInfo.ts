import { IQualityProfile } from "./IQualityProfile";
import { ITag } from "./ITag";

export interface ISonarrInstanceInfo {
  readonly rootFolders: string[];
  readonly qualityProfiles: IQualityProfile[];
  readonly tags: ITag[];
}
