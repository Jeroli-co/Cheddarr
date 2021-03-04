import React, { createContext, useContext } from "react";
import { DefaultAsyncCall, IAsyncCall } from "../models/IAsyncCall";
import { IProviderSettingsBase } from "../models/IProviderSettingsBase";
import { IRadarrConfig } from "../models/IRadarrConfig";
import { IRadarrInstanceInfo } from "../models/IRadarrInstanceInfo";
import { useRadarrConfigs } from "../hooks/useRadarrConfigs";

interface IRadarrConfigsContext {
  radarrConfigs: IAsyncCall<IRadarrConfig[] | null>;
  getRadarrInstanceInfo: (
    config: IProviderSettingsBase,
    withAlert: boolean
  ) => Promise<IAsyncCall<IRadarrInstanceInfo | null>>;
  createRadarrConfig: (
    config: IRadarrConfig
  ) => Promise<IAsyncCall<IRadarrConfig | null>>;
  updateRadarrConfig: (
    id: string,
    config: IRadarrConfig
  ) => Promise<IAsyncCall<IRadarrConfig | null>>;
  deleteRadarrConfig: (id: string) => void;
}

const RadarrConfigsContextDefaultImpl: IRadarrConfigsContext = {
  radarrConfigs: DefaultAsyncCall,
  createRadarrConfig(): Promise<IAsyncCall<IRadarrConfig | null>> {
    return Promise.resolve(DefaultAsyncCall);
  },
  deleteRadarrConfig(): Promise<void> {
    return Promise.resolve(undefined);
  },
  getRadarrInstanceInfo(): Promise<IAsyncCall<IRadarrInstanceInfo | null>> {
    return Promise.resolve(DefaultAsyncCall);
  },
  updateRadarrConfig(): Promise<IAsyncCall<IRadarrConfig | null>> {
    return Promise.resolve(DefaultAsyncCall);
  },
};

const RadarrConfigsContext = createContext<IRadarrConfigsContext>(
  RadarrConfigsContextDefaultImpl
);

export const useRadarrConfigsContext = () => useContext(RadarrConfigsContext);

export const RadarrConfigsContextProvider = (props: any) => {
  const radarrConfigsHook = useRadarrConfigs();
  return (
    <RadarrConfigsContext.Provider value={{ ...radarrConfigsHook }}>
      {props.children}
    </RadarrConfigsContext.Provider>
  );
};
