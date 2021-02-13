import React, { useEffect, useState } from "react";
import { useSession } from "./SessionContext";
import { useAPI } from "../hooks/useAPI";
import { APIRoutes } from "../enums/APIRoutes";

import { createContext, useContext } from "react";
import { DefaultAsyncCall, IAsyncCall } from "../models/IAsyncCall";
import { IPlexConfig } from "../../logged-in-app/pages/settings/components/plex/models/IPlexConfig";
import { DefaultAsyncData, IAsyncData } from "../models/IAsyncData";
import { useAlert } from "./AlertContext";
import { IPlexServerInfo } from "../../logged-in-app/pages/settings/components/plex/models/IPlexServerInfo";

interface PlexConfigContextInterface {
  configs: IAsyncCall<IPlexConfig[] | null>;
  currentConfig: IAsyncData<IPlexConfig | null>;
  readonly createConfig: (_: IPlexConfig) => void;
  readonly createConfigFromServerInfo: (_: IPlexServerInfo) => void;
  readonly updateConfig: (_: IPlexConfig) => void;
  readonly deleteConfig: (_: string) => Promise<IAsyncCall>;
  readonly addConfig: (_: IPlexConfig) => void;
  readonly isPlexAccountLinked: () => boolean;
}

export const PlexConfigContextDefaultImpl: PlexConfigContextInterface = {
  configs: DefaultAsyncCall,
  currentConfig: DefaultAsyncData,
  createConfig(_: IPlexConfig): void {},
  createConfigFromServerInfo(_: IPlexServerInfo): void {},
  updateConfig(_: IPlexConfig): void {},
  deleteConfig(_: string): Promise<IAsyncCall> {
    return Promise.resolve(DefaultAsyncCall);
  },
  addConfig(_: IPlexConfig): void {},
  isPlexAccountLinked(): boolean {
    return false;
  },
};

export const PlexConfigContext = createContext<PlexConfigContextInterface>(
  PlexConfigContextDefaultImpl
);

export const usePlexConfig = () => useContext(PlexConfigContext);

export default function PlexConfigContextProvider(props: any) {
  const {
    session: { plex },
  } = useSession();

  const [configs, setConfigs] = useState<IAsyncCall<IPlexConfig[] | null>>(
    DefaultAsyncCall
  );
  const [currentConfig, setCurrentConfig] = useState<
    IAsyncData<IPlexConfig | null>
  >(DefaultAsyncData);

  const { get, put, remove, post } = useAPI();

  const { pushSuccess, pushDanger } = useAlert();

  useEffect(() => {
    if (plex) {
      get<IPlexConfig[]>(APIRoutes.GET_PLEX_CONFIGS).then((res) => {
        if (res) {
          setConfigs(res);
        }
      });
    } else {
      setConfigs({ ...DefaultAsyncCall, isLoading: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plex]);

  useEffect(() => {
    if (!configs.isLoading && configs.data && configs.data?.length > 0) {
      setCurrentConfig({ data: configs.data[0], isLoading: false });
    } else {
      setCurrentConfig({ ...DefaultAsyncData, isLoading: false });
    }
  }, [configs]);

  const addConfig = (newConfig: IPlexConfig) => {
    if (configs.data) {
      let configurations = configs.data;
      configurations.push(newConfig);
      setConfigs({ ...configs, data: configurations });
    }
  };

  const createConfig = (config: IPlexConfig) => {
    post<IPlexConfig>(APIRoutes.CREATE_PLEX_CONFIG, config).then((res) => {
      if (res.data && res.status === 201) {
        addConfig(res.data);
        pushSuccess("Configuration created");
      } else {
        pushDanger("Cannot create config");
      }
    });
  };

  const createConfigFromServerInfo = (serverDetail: IPlexServerInfo) => {
    post<IPlexConfig>(APIRoutes.CREATE_PLEX_CONFIG, serverDetail).then(
      (res) => {
        if (res.data && res.status === 201) {
          addConfig(res.data);
          pushSuccess("Configuration created");
        } else {
          pushDanger("Cannot create config");
        }
      }
    );
  };

  const updateConfig = (newConfig: IPlexConfig) => {
    put<IPlexConfig>(
      APIRoutes.UPDATE_PLEX_CONFIG(newConfig.id),
      newConfig
    ).then((res) => {
      if (res.status === 200 && res.data) {
        let configurations = configs.data;
        if (configurations) {
          let indexOf = configurations.findIndex((c) => c.id === newConfig.id);
          if (indexOf !== -1) {
            configurations.splice(indexOf, 1, res.data);
            setConfigs({ ...configs, data: configurations });
          }
        }
        pushSuccess("Configuration updated");
      } else {
        pushDanger("Cannot update configuration");
      }
    });
  };

  const deleteConfig = (id: string) => {
    return remove(APIRoutes.DELETE_PLEX_CONFIG(id)).then((res) => {
      if (res.status === 200) {
        if (configs.data) {
          let configurations = configs.data.filter((c) => c.id !== id);
          setConfigs({ ...configs, data: configurations });
        }
      }
      return res;
    });
  };

  const isPlexAccountLinked = () => {
    return plex;
  };

  return (
    <PlexConfigContext.Provider
      value={{
        configs: configs,
        currentConfig: currentConfig,
        createConfig,
        createConfigFromServerInfo,
        updateConfig,
        deleteConfig,
        addConfig,
        isPlexAccountLinked,
      }}
    >
      {props.children}
    </PlexConfigContext.Provider>
  );
}
