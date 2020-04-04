import React, {createContext, useContext} from "react";
import {APIContext, methods} from "./APIContext";
import {AuthContext} from "./AuthContext";

const providers = {
  PLEX: "plex",
};

const ProvidersContext = createContext();

const ProvidersContextProvider = (props) => {

  const { executeRequest } = useContext(APIContext);
  const { handleError } = useContext(AuthContext);

  const getProviderConfig = async (provider) => {
    const res = await executeRequest(methods.GET, "/provider/" + provider + "/config/");
    switch (res.status) {
      case 200:
        return res;
      default:
        handleError(res);
        return null;
    }
  };

  const getProviderServer = async (provider) => {
    const res = await executeRequest(methods.GET, "/provider/" + provider + "/servers/");
    switch (res.status) {
      case 200:
        return res;
      default:
        handleError(res);
        return null;
    }
  };

  return (
    <ProvidersContext.Provider value={{
      getProviderConfig,
      getProviderServer
    }}>
      { props.children }
    </ProvidersContext.Provider>
  );
};

export {
  ProvidersContext,
  ProvidersContextProvider,
  providers
}