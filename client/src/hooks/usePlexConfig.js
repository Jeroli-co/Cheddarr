import {useContext} from "react";
import {useApi} from "./useApi";
import {NotificationContext} from "../contexts/NotificationContext";
import {AuthContext} from "../contexts/AuthContext";

const usePlexConfig = () => {

  const providerUrl = "/provider/plex/";

  const { executeRequest, methods } = useApi();
  const { handleError } = useContext(AuthContext);
  const { pushSuccess } = useContext(NotificationContext);

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
        pushSuccess("Configurations updated");
        return res;
      default:
        handleError(res);
        return null;
    }
  };

  return {
    getPlexConfig,
    getPlexServers,
    updatePlexServer,
    updateConfig
  }

};

export {
  usePlexConfig
}
