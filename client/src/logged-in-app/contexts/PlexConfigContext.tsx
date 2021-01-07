import React, { useEffect, useState } from "react";
import { useSession } from "../../shared/contexts/SessionContext";
import { useAPI } from "../../shared/hooks/useAPI";
import { APIRoutes } from "../../shared/enums/APIRoutes";

import { createContext, useContext } from "react";
import { DefaultAsyncCall, IAsyncCall } from "../../shared/models/IAsyncCall";
import { IPlexConfig } from "../pages/settings/components/plex/models/IPlexConfig";
import { DefaultAsyncData, IAsyncData } from "../../shared/models/IAsyncData";

interface PlexConfigContextInterface {
  configs: IAsyncCall<IPlexConfig[] | null>;
  currentConfig: IAsyncData<IPlexConfig | null>;
  readonly updateConfig: (_: IPlexConfig) => void;
  readonly deleteConfig: (_: string) => Promise<IAsyncCall>;
  readonly addConfig: (_: IPlexConfig) => void;
  readonly isPlexAccountLinked: () => boolean;
}

export const PlexConfigContextDefaultImpl: PlexConfigContextInterface = {
  configs: DefaultAsyncCall,
  currentConfig: DefaultAsyncData,
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

export const PlexConfigContextProvider = (props: any) => {
  const {
    session: { plex },
  } = useSession();

  const [configs, setConfigs] = useState<IAsyncCall<IPlexConfig[] | null>>(
    DefaultAsyncCall
  );
  const [currentConfig, setCurrentConfig] = useState<
    IAsyncData<IPlexConfig | null>
  >(DefaultAsyncData);

  const { get, put, remove } = useAPI();

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
    if (configs && configs.data && configs.data.length > 0) {
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

  const updateConfig = (newConfig: IPlexConfig) => {
    put<IPlexConfig>(APIRoutes.UPDATE_PLEX_CONFIG(newConfig.id)).then((res) => {
      if (res.data) {
        let configurations = configs.data;
        if (configurations) {
          let indexOf = configurations.findIndex((c) => c.id === newConfig.id);
          if (indexOf !== -1) {
            configurations.splice(indexOf, 1, res.data);
            setConfigs({ ...configs, data: configurations });
          }
        }
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
        updateConfig,
        deleteConfig,
        addConfig,
        isPlexAccountLinked,
      }}
    >
      {props.children}
    </PlexConfigContext.Provider>
  );
};
