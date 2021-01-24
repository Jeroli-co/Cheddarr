import { useEffect, useState } from "react";
import { IRadarrConfig } from "../pages/settings/models/IRadarrConfig";
import { DefaultAsyncCall, IAsyncCall } from "../../shared/models/IAsyncCall";
import { useAPI } from "../../shared/hooks/useAPI";
import { APIRoutes } from "../../shared/enums/APIRoutes";
import { useAlert } from "../../shared/contexts/AlertContext";
import { IProviderConfigBase } from "../pages/settings/models/IProviderConfigBase";
import { IRadarrInstanceInfo } from "../pages/settings/models/IRadarrInstanceInfo";

export const useRadarrConfig = () => {
  const [radarrConfig, setRadarrConfig] = useState<
    IAsyncCall<IRadarrConfig | null>
  >(DefaultAsyncCall);

  const { get, put, post } = useAPI();

  const { pushSuccess, pushDanger } = useAlert();

  useEffect(() => {
    get<IRadarrConfig[]>(APIRoutes.GET_RADARR_CONFIG).then((res) => {
      if (res.data && res.data.length > 0) {
        setRadarrConfig({
          data: res.data[0],
          status: res.status,
          isLoading: false,
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getRadarrInstanceInfo = (
    config: IProviderConfigBase,
    withAlert: boolean
  ) => {
    return post<IRadarrInstanceInfo>(
      APIRoutes.GET_RADARR_INSTANCE_INFO,
      config
    ).then((res) => {
      if (res.status === 200) {
        if (withAlert) pushSuccess("Successful connection");
      } else {
        pushDanger("Cannot get instance info");
      }
      return res;
    });
  };

  const createRadarrConfig = (config: IRadarrConfig) => {
    post<IRadarrConfig>(APIRoutes.CREATE_RADARR_CONFIG, config).then((res) => {
      if (res.status === 201) {
        setRadarrConfig(res);
        pushSuccess("Configuration created");
      } else {
        pushDanger("Cannot create configuration");
      }
    });
  };

  const updateRadarrConfig = (id: string, config: IRadarrConfig) => {
    put<IRadarrConfig>(APIRoutes.UPDATE_RADARR_CONFIG(id), config).then(
      (res) => {
        if (res.status === 200) {
          setRadarrConfig(res);
          pushSuccess("Configuration updated");
        } else {
          pushDanger("Cannot update configuration");
        }
      }
    );
  };

  return {
    radarrConfig,
    getRadarrInstanceInfo,
    createRadarrConfig,
    updateRadarrConfig,
  };
};
