import React, {useContext, useEffect, useState} from "react";
import {providers, ProvidersContext} from "../contexts/ProvidersContext";

const initialConfig = {
  providerApiKey: null,
  enabled: null,
  plexUserId: null,
  machineId: null,
  loading: true,
};

const usePlexConfig = () => {

  const [config, setConfig] = useState(initialConfig);
  const { getProviderConfig } = useContext(ProvidersContext);

  useEffect(() => {
    getProviderConfig(providers.PLEX).then(res => {
      if (res) {
        setConfig({
          providerApiKey: res.data["provider_api_key"],
          enabled: res.data.enabled,
          plexUserId: res.data["plex_user_id"],
          machineId: res.data["machine_id"],
          loading: false,
        });
      } else {
        setConfig({ ...initialConfig, loading: false });
      }
    });
  }, []);

  return {
    ...config
  }

};

export {
  usePlexConfig
}