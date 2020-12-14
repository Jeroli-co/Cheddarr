import { createContext } from "react";
import { IPlexConfig } from "../../models/IPlexConfig";
import {
  AsyncResponseSuccess,
  IAsyncResponse,
} from "../../models/IAsyncResponse";

interface PlexConfigContextInterface {
  configs: IPlexConfig[];
  currentConfig: IPlexConfig | null;
  isLoading: boolean;
  readonly updateConfig: (_: IPlexConfig) => void;
  readonly deleteConfig: (_: string) => Promise<IAsyncResponse<any | null>>;
  readonly addConfig: (_: IPlexConfig) => void;
  readonly isPlexAccountLinked: () => boolean;
}

export const PlexConfigContextDefaultImpl: PlexConfigContextInterface = {
  configs: [],
  currentConfig: null,
  isLoading: false,
  updateConfig(_: IPlexConfig): void {},
  deleteConfig(_: string): Promise<IAsyncResponse<any | null>> {
    return Promise.resolve(new AsyncResponseSuccess(""));
  },
  addConfig(_: IPlexConfig): void {},
  isPlexAccountLinked(): boolean {
    return false;
  },
};

export const PlexConfigContext = createContext<PlexConfigContextInterface>(
  PlexConfigContextDefaultImpl
);
