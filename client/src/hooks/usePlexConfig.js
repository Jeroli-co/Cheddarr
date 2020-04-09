import {useContext, useState} from "react";
import {useApi} from "./useApi";
import {NotificationContext} from "../contexts/NotificationContext";
import {AuthContext} from "../contexts/AuthContext";

const usePlexConfig = () => {

  const providerUrl = "/provider/plex/";

  const [config, setConfig] = useState({ loaded: false });
  const [servers, setServers] = useState(null);

  const { executeRequest, methods } = useApi();
  const { handleError } = useContext(AuthContext);
  const { pushSuccess } = useContext(NotificationContext);

  const getPlexConfig = async () => {
    const res = await executeRequest(methods.GET, providerUrl + "config/");
    switch (res.status) {
      case 200:
        setConfig({
          enabled: res.data.enabled,
          machineName: res.data["machine_name"],
          machineId: res.data["machine_id"],
          loaded: true,
        });
        return res;
      default:
        handleError(res);
        return null;
    }
  };

  const getPlexServers = async () => {
    const res = await executeRequest(methods.GET, providerUrl + "servers/");
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
    const enabled = newConfig.hasOwnProperty('enabled') ? newConfig.enabled : config.enabled;
    const machineName = newConfig.hasOwnProperty('machineName') ? newConfig.machineName : config.machineName;
    const machineId = newConfig.hasOwnProperty('machineId') ? newConfig.machineId : config.machineId;
    fd.append("enabled", enabled);
    fd.append("machine_name", machineName);
    fd.append("machine_id", machineId);
    fd.forEach(data => console.log(data));
    const res = await executeRequest(methods.PUT, providerUrl + "config/", fd);
    switch (res.status) {
      case 200:
        setConfig({
          ...config,
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

  return {
    ...config,
    servers,
    getPlexConfig,
    getPlexServers,
    updatePlexServer,
    updateConfig
  }

};

export {
  usePlexConfig
}
