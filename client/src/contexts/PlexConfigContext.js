import React, {createContext, useContext, useEffect, useState} from "react";
import {useApi} from "../hooks/useApi";
import {AuthContext} from "./AuthContext";
import {NotificationContext} from "./NotificationContext";

const PlexConfigContext = createContext();

const PlexConfigContextProvider = (props) => {

  const [config, setConfig] = useState(null);

  const providerUrl = "/provider/plex/";

  const { executeRequest, methods } = useApi();
  const { handleError } = useContext(AuthContext);
  const { pushSuccess } = useContext(NotificationContext);

  useEffect(() => {
    getPlexConfig().then(data => { if (data) setConfig(data) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getPlexConfig = async () => {
    const res = await executeRequest(methods.GET, providerUrl + "config/");
    switch (res.status) {
      case 200:
        return res.data;
      default:
        handleError(res);
        return null;
    }
  };

  const getPlexServers = async () => {
    const res = await executeRequest(methods.GET, providerUrl + "servers/");
    switch (res.status) {
      case 200:
        return res.data;
      default:
        handleError(res);
        return null;
    }
  };

  const updatePlexServer = async (machineId, machineName) => {
    return await updateConfig({"machine_id": machineId, "machine_name": machineName});
  };

  const updateConfig = async (newConfig) => {
    const fd = new FormData();
    Object.keys(newConfig).forEach(key => {
      fd.append(key, newConfig[key])
    });
    const res = await executeRequest(methods.PATCH, providerUrl + "config/", fd);
    switch (res.status) {
      case 200:
        setConfig(res.data);
        pushSuccess("Configurations updated");
        return res;
      default:
        handleError(res);
        return null;
    }
  };

  return (
    <PlexConfigContext.Provider value={{
      config,
      updateConfig,
      updatePlexServer,
      getPlexServers
    }}>
      { props.children }
    </PlexConfigContext.Provider>
  )

}

export {
  PlexConfigContext,
  PlexConfigContextProvider
}
