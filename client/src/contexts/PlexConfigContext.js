import React, {createContext, useContext, useEffect, useState} from "react";
import {APIContext, methods} from "./APIContext";
import {providers, ProvidersContext} from "./ProvidersContext";
import {AuthContext} from "./AuthContext";

const PlexConfigContext = createContext();

const initialConfig = {
  providerApiKey: null,
  enabled: null,
  plexUserId: null,
  machineName: null,
  loading: true,
};

const PlexConfigContextProvider = (props) => {

  const [config, setConfig] = useState(initialConfig);
  const [servers, setServers] = useState(null);

  const { getProviderConfig } = useContext(ProvidersContext);
  const { executeRequest } = useContext(APIContext);
  const { handleError } = useContext(AuthContext);

  useEffect(() => {
    getProviderConfig(providers.PLEX).then(res => {
      if (res) {
        setConfig({
          providerApiKey: res.data["provider_api_key"],
          enabled: res.data.enabled,
          plexUserId: res.data["plex_user_id"],
          machineName: res.data["machine_name"],
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

  const updateServer = async (machineName) => {
    const fd = new FormData();
    fd.append("machine_name", machineName);
    const res = await executeRequest(methods.PATCH, "/provider/plex/config/", fd);
    switch (res.status) {
      case 200:
        setConfig({
          ...config,
          machineName: res.data["machine_name"]
        });
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
      updateServer
    }}>
      { props.children }
    </PlexConfigContext.Provider>
  );
};

export {
  PlexConfigContext,
  PlexConfigContextProvider
}