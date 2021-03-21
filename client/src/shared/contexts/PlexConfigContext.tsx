import React, { useEffect, useState } from "react";
import { useAPI } from "../hooks/useAPI";
import { APIRoutes } from "../enums/APIRoutes";

import { createContext, useContext } from "react";
import { DefaultAsyncCall, IAsyncCall } from "../models/IAsyncCall";
import { useAlert } from "./AlertContext";
import { IMediaServerConfig } from "../models/IMediaServerConfig";

interface PlexConfigContextInterface {
  configs: IAsyncCall<IMediaServerConfig[] | null>;
  createConfig: (_: IMediaServerConfig) => Promise<IAsyncCall>;
  updateConfig: (_: IMediaServerConfig) => Promise<IAsyncCall>;
  deleteConfig: (_: string) => Promise<IAsyncCall>;
  addConfig: (_: IMediaServerConfig) => void;
  hasPlexConfigs: () => boolean;
}

export const PlexConfigContextDefaultImpl: PlexConfigContextInterface = {
  createConfig(_: IMediaServerConfig): Promise<IAsyncCall> {
    return Promise.resolve(DefaultAsyncCall);
  },
  updateConfig(_: IMediaServerConfig): Promise<IAsyncCall> {
    return Promise.resolve(DefaultAsyncCall);
  },
  configs: DefaultAsyncCall,
  deleteConfig(_: string): Promise<IAsyncCall> {
    return Promise.resolve(DefaultAsyncCall);
  },
  addConfig(_: IMediaServerConfig): void {},
  hasPlexConfigs(): boolean {
    return false;
  },
};

export const PlexConfigContext = createContext<PlexConfigContextInterface>(
  PlexConfigContextDefaultImpl
);

export const usePlexConfig = () => useContext(PlexConfigContext);

export default function PlexConfigContextProvider(props: any) {
  const [configs, setConfigs] = useState<
    IAsyncCall<IMediaServerConfig[] | null>
  >(DefaultAsyncCall);

  const { get, put, remove, post } = useAPI();

  const { pushSuccess, pushDanger } = useAlert();

  useEffect(() => {
    get<IMediaServerConfig[]>(APIRoutes.GET_PLEX_CONFIGS).then((res) => {
      if (res) setConfigs(res);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addConfig = (newConfig: IMediaServerConfig) => {
    if (configs.data) {
      let configurations = configs.data;
      configurations.push(newConfig);
      setConfigs({ ...configs, data: configurations });
    }
  };

  const createConfig = (config: IMediaServerConfig) => {
    return post<IMediaServerConfig>(APIRoutes.CREATE_PLEX_CONFIG, config).then(
      (res) => {
        if (res.data && res.status === 201) {
          addConfig(res.data);
          pushSuccess("Configuration created");
        } else if (res.status === 409) {
          pushDanger("Config already added");
        } else {
          pushDanger("Cannot create config");
        }
        return res;
      }
    );
  };

  const updateConfig = (newConfig: IMediaServerConfig) => {
    return put<IMediaServerConfig>(
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
      return res;
    });
  };

  const deleteConfig = (id: string) => {
    return remove(APIRoutes.DELETE_PLEX_CONFIG(id)).then((res) => {
      if (res.status === 200) {
        if (configs.data) {
          let configurations = configs.data.filter((c) => c.id !== id);
          setConfigs({ ...configs, data: configurations });
          pushSuccess("Config deleted");
        }
      } else {
        pushDanger("Cannot delete config");
      }
      return res;
    });
  };

  const hasPlexConfigs = () => {
    return configs.data !== null && configs.data.length > 0;
  };

  return (
    <PlexConfigContext.Provider
      value={{
        configs,
        createConfig,
        updateConfig,
        deleteConfig,
        addConfig,
        hasPlexConfigs,
      }}
    >
      {props.children}
    </PlexConfigContext.Provider>
  );
}
