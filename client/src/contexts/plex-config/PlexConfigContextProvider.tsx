import React, { useContext, useEffect, useState } from "react";
import { IPlexConfig } from "../../models/IPlexConfig";
import { PlexConfigContext } from "./PlexConfigContext";
import { PlexService } from "../../services/PlexService";
import { AuthContext } from "../auth/AuthContext";

export const PlexConfigContextProvider = (props: any) => {
  const [configs, setConfigs] = useState<{
    data: IPlexConfig[];
    loading: boolean;
  }>({ data: [], loading: true });

  const {
    session: { plex },
  } = useContext(AuthContext);

  useEffect(() => {
    PlexService.GetPlexConfig().then((res) => {
      if (res.error === null) {
        setConfigs({ data: res.data, loading: false });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addConfig = (newConfig: IPlexConfig) => {
    let configurations = configs.data;
    configurations.push(newConfig);
    setConfigs({ ...configs, data: configurations });
  };

  const updateConfig = (newConfig: IPlexConfig) => {
    PlexService.UpdatePlexConfig(configs.data[0].id, newConfig).then((res) => {
      if (res.error === null) {
        /*
        let conf = configs.data.find(c => c.id === res.data.id);
        if (conf) {
          conf = res.data;
          setConfig({ data: res.data[0], loading: false });
        }
        */
      }
    });
  };

  const deleteConfig = (id: string) => {
    return PlexService.DeletePlexConfig(id).then((res) => {
      if (res.error === null) {
        let conf = configs.data.filter((c) => c.id !== id);
        if (conf) {
          setConfigs({ data: conf, loading: false });
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
        configs: configs.data,
        isLoading: configs.loading,
        currentConfig: configs.data.length > 0 ? configs.data[0] : null,
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
