import React, {createContext, useContext, useEffect, useState} from "react";
import {APIContext, methods} from "./APIContext";
import {providers, ProvidersContext} from "./ProvidersContext";
import {AuthContext} from "./AuthContext";
import {NotificationContext} from "./NotificationContext";

const PlexConfigContext = createContext();

const initialConfig = {
  providerApiKey: null,
  enabled: null,
  machineName: null,
  machineId: null,
  loading: true,
};

const PlexConfigContextProvider = (props) => {

  const [config, setConfig] = useState(initialConfig);
  const [servers, setServers] = useState(null);

  const { getProviderConfig } = useContext(ProvidersContext);
  const { executeRequest } = useContext(APIContext);
  const { handleError } = useContext(AuthContext);
  const { pushSuccess } = useContext(NotificationContext);

  useEffect(() => {
    getProviderConfig(providers.PLEX).then(res => {
      if (res) {
        setConfig({
          providerApiKey: res.data["provider_api_key"],
          enabled: res.data.enabled,
          machineName: res.data["machine_name"],
          machineId: res.data["machine_id"],
          loading: false,
        });
      } else {
        setConfig({ ...initialConfig, loading: false });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getPlexServers = async () => {
    const res = await executeRequest(methods.GET, "/provider/plex/servers/", null, null, false);
    switch (res.status) {
      case 200:
        setServers(res.data);
        return res;
      default:
        handleError(res);
        return null;
    }
  };

  const updatePlexServer = async (machineId, machineName) => {
    return await updateConfig({machineId: machineId, machineName: machineName});
  };

  const updateConfig = async (newConfig) => {
    const fd = new FormData();
    const providerApiKey = newConfig.hasOwnProperty('providerApiKey') ? newConfig.providerApiKey : config.providerApiKey;
    const enabled = newConfig.hasOwnProperty('enabled') ? newConfig.enabled : config.enabled;
    const machineName = newConfig.hasOwnProperty('machineName') ? newConfig.machineName : config.machineName;
    const machineId = newConfig.hasOwnProperty('machineId') ? newConfig.machineId : config.machineId;
    fd.append("provider_api_key", providerApiKey);
    fd.append("enabled", enabled);
    fd.append("machine_name", machineName);
    fd.append("machine_id", machineId);
    fd.forEach(data => console.log(data));
    const res = await executeRequest(methods.PUT, "/provider/plex/config/", fd);
    switch (res.status) {
      case 200:
        setConfig({
          ...config,
          providerApiKey: res.data["provider_api_key"],
          enabled: res.data.enabled,
          machineName: res.data["machine_name"],
          machineId: res.data["machine_id"]
        });
        pushSuccess("Configurations updated");
        return res;
      default:
        handleError(res);
        return null;
    }
  };

  return (
    <PlexConfigContext.Provider value={{
      ...config,
      servers,
      getPlexServers,
      updatePlexServer,
      updateConfig
    }}>
      { props.children }
    </PlexConfigContext.Provider>
  );
};

export {
  PlexConfigContext,
  PlexConfigContextProvider
}