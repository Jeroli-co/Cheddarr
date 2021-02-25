import { ProviderTypes } from "../enums/ProviderTypes";
import { IProviderConfigBase } from "./IProviderConfigBase";

export interface IPlexSettings extends IProviderConfigBase {
  id: string;
  name: string;
  enabled: boolean;
  providerType: ProviderTypes;
  serverName: string;
  serverId: string;
}
