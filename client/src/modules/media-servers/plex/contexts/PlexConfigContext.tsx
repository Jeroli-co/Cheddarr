import { createContext } from "react";
import { IPlexConfig } from "../models/IPlexConfig";

interface PlexConfigContextInterface {
  config: IPlexConfig | null;
  isLoading: boolean;
  readonly updateConfig: (config: IPlexConfig) => void;
  readonly isPlexAccountLinked: () => boolean;
  readonly isPlexServerLinked: () => boolean;
}

export const PlexConfigContextDefaultImpl: PlexConfigContextInterface = {
  config: null,
  isLoading: false,
  updateConfig(config: IPlexConfig): void {
    this.config = config;
  },
  isPlexAccountLinked(): boolean {
    return false;
  },
  isPlexServerLinked(): boolean {
    return false;
  },
};

export const PlexConfigContext = createContext<PlexConfigContextInterface>(
  PlexConfigContextDefaultImpl
);
