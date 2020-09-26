import { useApi } from "../../../api/hooks/useApi";
import { useContext } from "react";
import { AuthContext } from "../../../auth/contexts/AuthContext";
import { NotificationContext } from "../../../notifications/contexts/NotificationContext";

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
      methods.PATCH,
      providerUrl + "config/test/",
      config
    );
    switch (res.status) {
      case 200:
        pushSuccess("Connection successful");
        return res.data;
      default:
        pushDanger("Connection failed");
        return null;
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

  return {
    getSonarrStatus,
    testSonarrConfig,
    getSonarrConfig,
    updateSonarrConfig,
  };
};

export { useSonarr };
