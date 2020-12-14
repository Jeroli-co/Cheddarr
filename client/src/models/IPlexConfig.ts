import { ProviderTypes } from "../enums/ProviderTypes";
import { IPlexServerInfo } from "./IPlexServerInfo";
import { IProviderConfigBase } from "./IProviderConfigBase";

export interface IPlexConfig extends IProviderConfigBase, IPlexServerInfo {
  readonly id: string;
  readonly name: string;
  readonly enabled: boolean;
  readonly providerType: ProviderTypes;
}
