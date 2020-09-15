import { useApi } from "./useApi";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { NotificationContext } from "../contexts/NotificationContext";

const useSonarr = () => {
  const providerUrl = "/providers/sonarr/";
  const { executeRequest, methods } = useApi();
  const { handleError } = useContext(AuthContext);
  const { pushSuccess, pushDanger } = useContext(NotificationContext);

  const getSonarrStatus = async () => {
    const res = await executeRequest(methods.GET, providerUrl + "status/");
    switch (res.status) {
      case 200:
        return !!res.data.status;
      default:
        return false;
    }
  };

  const testSonarrConfig = async (config) => {
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

  const getSonarrConfig = async () => {
    const res = await executeRequest(methods.GET, providerUrl + "config/");
    switch (res.status) {
      case 200:
        return res.data;
      default:
        handleError(res);
        return null;
    }
  };

  const updateSonarrConfig = async (newConfig) => {
    const res = await executeRequest(
      methods.PATCH,
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

  const getSonarrRootFolders = async () => {
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

  const getSonarrProfiles = async () => {
    const res = await executeRequest(methods.GET, providerUrl + "profiles/");
    switch (res.status) {
      case 200:
        return res.data;
      default:
        handleError(res);
        return null;
    }
  };

  const getSonarrLanguages = async () => {
    const res = await executeRequest(
      methods.GET,
      providerUrl + "languages-profiles/"
    );
    switch (res.status) {
      case 200:
        return res.data;
      default:
        handleError(res);
        return null;
    }
  };

  return {
    getSonarrStatus,
    testSonarrConfig,
    getSonarrConfig,
    updateSonarrConfig,
    getSonarrRootFolders,
    getSonarrProfiles,
    getSonarrLanguages,
  };
};

export { useSonarr };
