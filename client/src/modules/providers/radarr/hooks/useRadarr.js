import { useContext } from "react";
import { AuthContext } from "../../../auth/contexts/AuthContext";
import { NotificationContext } from "../../../notifications/contexts/NotificationContext";
import { HttpService } from "../../../api/services/HttpService";
import { HTTP_METHODS } from "../../../api/enums/HttpMethods";

const useRadarr = () => {
  const providerUrl = "/providers/radarr/";
  const { handleError } = useContext(AuthContext);
  const { pushSuccess, pushDanger } = useContext(NotificationContext);

  const getRadarrStatus = async () => {
    const res = await HttpService.executeRequest(
      HTTP_METHODS.GET,
      providerUrl + "status/"
    );
    switch (res.status) {
      case 200:
        return !!res.data.status;
      default:
        return false;
    }
  };

  const testRadarrConfig = async (config) => {
    const res = await HttpService.executeRequest(
      HTTP_METHODS.PATCH,
      providerUrl + "config/",
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

  const getRadarrConfig = async () => {
    const res = await HttpService.executeRequest(
      HTTP_METHODS.GET,
      providerUrl + "config/"
    );
    switch (res.status) {
      case 200:
        return res.data;
      default:
        handleError(res);
        return null;
    }
  };

  const updateRadarrConfig = async (newConfig) => {
    const res = await HttpService.executeRequest(
      HTTP_METHODS.PUT,
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
    getRadarrStatus,
    testRadarrConfig,
    getRadarrConfig,
    updateRadarrConfig,
  };
};

export { useRadarr };
