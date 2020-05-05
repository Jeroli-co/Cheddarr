import React, { createContext, useContext, useEffect, useState } from "react";
import { useApi } from "../hooks/useApi";
import { AuthContext } from "./AuthContext";
import { NotificationContext } from "./NotificationContext";

const PlexConfigContext = createContext();

const PlexConfigContextProvider = (props) => {
  const [config, setConfig] = useState(null);

  const providerUrl = "/provider/plex/";

  const { executeRequest, methods } = useApi();
  const { handleError } = useContext(AuthContext);
  const { pushSuccess, pushInfo } = useContext(NotificationContext);

  useEffect(() => {
    getPlexConfig().then((data) => {
      if (data) setConfig(data);
    });
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

  const unlinkPlexAccount = async () => {
    const res = await executeRequest(methods.GET, providerUrl + "unlink/");
    switch (res.status) {
      case 200:
        pushInfo(res.message);
        setConfig({});
        return res.data;
      default:
        handleError(res);
        return null;
    }
  };

  const updateConfig = async (newConfig) => {
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

  const isPlexAccountLinked = (config) => {
    return (
      config["enabled"] === true && typeof config["enabled"] !== "undefined"
    );
  };

  const isPlexServerLinked = (config) => {
    return (
      config["machine_name"] !== null &&
      typeof config["machine_name"] !== "undefined"
    );
  };

  return (
    <PlexConfigContext.Provider
      value={{
        config,
        updateConfig,
        getPlexServers,
        isPlexServerLinked,
        isPlexAccountLinked,
        unlinkPlexAccount,
      }}
    >
      {props.children}
    </PlexConfigContext.Provider>
  );
};

export { PlexConfigContext, PlexConfigContextProvider };
