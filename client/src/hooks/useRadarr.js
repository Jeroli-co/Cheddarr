import { useApi } from "./useApi";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { NotificationContext } from "../contexts/NotificationContext";

const useRadarr = () => {
  const providerUrl = "/providers/radarr/";
  const { executeRequest, methods } = useApi();
  const { handleError } = useContext(AuthContext);
  const { pushSuccess, pushDanger } = useContext(NotificationContext);

  const getRadarrStatus = async () => {
    const res = await executeRequest(methods.GET, providerUrl + "status/");
    switch (res.status) {
      case 200:
        return !!res.data.status;
      default:
        return false;
    }
  };

  const testRadarrConfig = async (config) => {
    const res = await executeRequest(
      methods.POST,
      providerUrl + "config/test/",
      config
    );
    switch (res.status) {
      case 200:
        pushSuccess("Connection successful");
        return !!res.data.status;
      default:
        pushDanger("Connection failed");
        return false;
    }
  };

  const getRadarrConfig = async () => {
    const res = await executeRequest(methods.GET, providerUrl + "config/");
    switch (res.status) {
      case 200:
        return res.data;
      default:
        handleError(res);
        return null;
    }
  };

  const updateRadarrConfig = async (newConfig) => {
    const res = await executeRequest(
      methods.PUT,
      providerUrl + "config/",
      newConfig
    );
    switch (res.status) {
      case 200:
        pushSuccess("Configurations updated");
        return res;
      default:
        handleError(res);
        return null;
    }
  };

  const getRadarrRootFolders = async () => {
    const res = await executeRequest(
      methods.GET,
      providerUrl + "root-folders/"
    );
    switch (res.status) {
      case 200:
        return res.data;
      default:
        handleError(res);
        return null;
    }
  };

  const getRadarrProfiles = async () => {
    const res = await executeRequest(methods.GET, providerUrl + "profiles/");
    switch (res.status) {
      case 200:
        return res.data;
      default:
        handleError(res);
        return null;
    }
  };

  return {
    getRadarrStatus,
    testRadarrConfig,
    getRadarrConfig,
    updateRadarrConfig,
    getRadarrRootFolders,
    getRadarrProfiles,
  };
};

export { useRadarr };
