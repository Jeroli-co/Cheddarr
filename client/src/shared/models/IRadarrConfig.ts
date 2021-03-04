import { IProviderSettingsBase } from "./IProviderSettingsBase";
import { ProviderTypes } from "../enums/ProviderTypes";

export interface IRadarrConfig extends IProviderSettingsBase {
  readonly id: string;
  readonly name: string;
  readonly enabled: boolean;
  readonly providerType: ProviderTypes;
  readonly rootFolder: string;
  readonly qualityProfileId: number;
  readonly version: number;
}
