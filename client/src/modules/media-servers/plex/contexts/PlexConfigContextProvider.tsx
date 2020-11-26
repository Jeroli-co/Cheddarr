import React, { useEffect, useState } from "react";
import { IPlexConfig } from "../models/IPlexConfig";
import { PlexConfigContext } from "./PlexConfigContext";
import { PlexService } from "../services/PlexService";

export const PlexConfigContextProvider = (props: any) => {
  const [config, setConfig] = useState<{
    data: IPlexConfig | null;
    loading: boolean;
  }>({ data: null, loading: true });

  useEffect(() => {
    PlexService.GetPlexConfig().then((res) => {
      if (res.error === null) {
        setConfig({ data: res.data, loading: false });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateConfig = (config: IPlexConfig) => {
    PlexService.UpdateConfig(config).then((res) => {
      if (res.error === null) {
        setConfig({ data: res.data, loading: false });
      }
    });
  };

  const isPlexAccountLinked = () => {
    return config !== null;
  };

  const isPlexServerLinked = () => {
    return config.data!.servers.length > 0;
  };

  return (
    <PlexConfigContext.Provider
      value={{
        config: config.data,
        isLoading: config.loading,
        updateConfig,
        isPlexAccountLinked,
        isPlexServerLinked,
      }}
    >
      {props.children}
    </PlexConfigContext.Provider>
  );
};
