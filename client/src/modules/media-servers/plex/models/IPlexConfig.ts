import { ProviderTypes } from "../../../providers/enums/ProviderTypes";
import { IPlexServer } from "./IPlexServer";

export interface IPlexConfig {
  id: string;
  apiKey: string;
  name: string;
  enabled: boolean;
  providerType: ProviderTypes;
  servers: IPlexServer[];
}
