import { useApi } from "./useApi";
import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { NotificationContext } from "../contexts/NotificationContext";

const useRadarr = () => {
  const providerUrl = "/provider/radarr/";
  const { executeRequest, methods } = useApi();
  const { handleError } = useContext(AuthContext);
  const { pushSuccess } = useContext(NotificationContext);
  const [config, setConfig] = useState(null);

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
      methods.PATCH,
      providerUrl + "config/",
      newConfig
    );
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

  return {
    getRadarrConfig,
    updateRadarrConfig,
  };
};

export { useRadarr };
