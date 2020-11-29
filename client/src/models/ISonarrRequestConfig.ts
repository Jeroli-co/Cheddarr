import { IRadarrRequestConfig } from "./IRadarrRequestConfig";
import { ILanguageProfile } from "./ILanguageProfile";

export interface ISonarrRequestConfig extends IRadarrRequestConfig {
  languageProfiles: ILanguageProfile[];
}
