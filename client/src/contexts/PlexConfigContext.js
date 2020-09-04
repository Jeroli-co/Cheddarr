import React, { createContext, useContext, useEffect, useState } from "react";
import { useApi } from "../hooks/useApi";
import { AuthContext } from "./AuthContext";
import { NotificationContext } from "./NotificationContext";

const PlexConfigContext = createContext();

const PlexConfigContextProvider = (props) => {
  const [config, setConfig] = useState(null);

  const providerUrl = "/providers/plex/";

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
    const res = await executeRequest(methods.DELETE, providerUrl + "config/");
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

  const addPlexServer = async (server) => {
    const res = await executeRequest(
      methods.POST,
      providerUrl + "config/servers/",
      server
    );
    switch (res.status) {
      case 200:
        setConfig(res.data);
        pushSuccess("Server added");
        return res;
      default:
        handleError(res);
        return null;
    }
  };

  const removePlexServer = async (machine_id) => {
    const res = await executeRequest(
      methods.DELETE,
      providerUrl + "config/servers/" + machine_id.machine_id
    );
    switch (res.status) {
      case 200:
        setConfig(res.data);
        pushSuccess("Server removed");
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
      config.servers.length > 0 &&
      config.servers[0]["name"] !== null &&
      typeof config.servers[0]["name"] !== "undefined"
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
        addPlexServer,
        removePlexServer,
      }}
    >
      {props.children}
    </PlexConfigContext.Provider>
  );
};

export { PlexConfigContext, PlexConfigContextProvider };
