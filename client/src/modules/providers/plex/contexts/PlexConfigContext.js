import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../auth/contexts/AuthContext";
import { NotificationContext } from "../../../notifications/contexts/NotificationContext";
import { isEmptyObject } from "../../../../utils/objects";
import { HttpService } from "../../../api/services/HttpService";
import { HTTP_METHODS } from "../../../api/enums/HttpMethods";

const PlexConfigContext = createContext();

const PlexConfigContextProvider = (props) => {
  const [config, setConfig] = useState(null);

  const providerUrl = "/media-servers/plex/";

  const { handleError } = useContext(AuthContext);
  const { pushSuccess, pushInfo } = useContext(NotificationContext);

  useEffect(() => {
    getPlexConfig().then((data) => {
      if (data) setConfig(data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getPlexConfig = async () => {
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

  const getPlexServers = async () => {
    const res = await HttpService.executeRequest(
      HTTP_METHODS.GET,
      providerUrl + "servers/"
    );
    switch (res.status) {
      case 200:
        return res.data;
      default:
        handleError(res);
        return null;
    }
  };

  const unlinkPlexAccount = async () => {
    const res = await HttpService.executeRequest(
      HTTP_METHODS.DELETE,
      providerUrl + "config/"
    );
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
    const res = await HttpService.executeRequest(
      HTTP_METHODS.PATCH,
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
    const res = await HttpService.executeRequest(
      HTTP_METHODS.POST,
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
    const res = await HttpService.executeRequest(
      HTTP_METHODS.DELETE,
      providerUrl + "config/servers/" + machine_id + "/"
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

  const isPlexAccountLinked = () => {
    return !isEmptyObject(config);
  };

  const isPlexServerLinked = () => {
    return (
      config["servers"].length > 0 &&
      config["servers"][0]["name"] !== null &&
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
