import React, { createContext, useContext } from "react";
import { useSonarrConfigs } from "../hooks/useSonarrConfigs";
import { ISonarrConfig } from "../models/ISonarrConfig";
import { DefaultAsyncCall, IAsyncCall } from "../models/IAsyncCall";
import { ISonarrInstanceInfo } from "../models/ISonarrInstanceInfo";
import { IProviderSettingsBase } from "../models/IProviderSettingsBase";

interface ISonarrConfigsContext {
  sonarrConfigs: IAsyncCall<ISonarrConfig[] | null>;
  getSonarrInstanceInfo: (
    config: IProviderSettingsBase,
    withAlert: boolean
  ) => Promise<IAsyncCall<ISonarrInstanceInfo | null>>;
  createSonarrConfig: (
    config: ISonarrConfig
  ) => Promise<IAsyncCall<ISonarrConfig | null>>;
  updateSonarrConfig: (
    id: string,
    config: ISonarrConfig
  ) => Promise<IAsyncCall<ISonarrConfig | null>>;
  deleteSonarrConfig: (id: string) => void;
}

const SonarrConfigsContextDefaultImpl: ISonarrConfigsContext = {
  sonarrConfigs: DefaultAsyncCall,
  createSonarrConfig(): Promise<IAsyncCall<ISonarrConfig | null>> {
    return Promise.resolve(DefaultAsyncCall);
  },
  deleteSonarrConfig(): Promise<void> {
    return Promise.resolve(undefined);
  },
  getSonarrInstanceInfo(): Promise<IAsyncCall<ISonarrInstanceInfo | null>> {
    return Promise.resolve(DefaultAsyncCall);
  },
  updateSonarrConfig(): Promise<IAsyncCall<ISonarrConfig | null>> {
    return Promise.resolve(DefaultAsyncCall);
  },
};

const SonarrConfigsContext = createContext<ISonarrConfigsContext>(
  SonarrConfigsContextDefaultImpl
);

export const useSonarrConfigsContext = () => useContext(SonarrConfigsContext);

export const SonarrConfigsContextProvider = (props: any) => {
  const sonarrConfigsHook = useSonarrConfigs();
  return (
    <SonarrConfigsContext.Provider value={{ ...sonarrConfigsHook }}>
      {props.children}
    </SonarrConfigsContext.Provider>
  );
};
