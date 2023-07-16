import { useEffect, useState } from "react";
import { IRadarrConfig } from "../models/IRadarrConfig";
import { IAsyncCall } from "../models/IAsyncCall";
import { useAPI } from "./useAPI";
import { APIRoutes } from "../enums/APIRoutes";
import { useAlert } from "../contexts/AlertContext";
import { IProviderSettingsBase } from "../models/IProviderSettingsBase";
import { IRadarrInstanceInfo } from "../models/IRadarrInstanceInfo";

export const useRadarrConfigs = () => {
  const [radarrConfigs, setRadarrConfigs] = useState<
    IAsyncCall<IRadarrConfig[]>
  >({ data: [], status: -1, isLoading: true });

  const { get, put, post, remove } = useAPI();

  const { pushSuccess, pushDanger } = useAlert();

  useEffect(() => {
    get<IRadarrConfig[]>(APIRoutes.GET_RADARR_CONFIG).then((res) => {
      if (res.data) setRadarrConfigs(res);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getRadarrInstanceInfo = (
    config: IProviderSettingsBase,
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
    return post<IRadarrConfig>(APIRoutes.CREATE_RADARR_CONFIG, config).then(
      (res) => {
        if (res.status === 201 && res.data) {
          const configs = radarrConfigs.data;
          if (configs) {
            configs.push(res.data);
            setRadarrConfigs({ ...radarrConfigs, data: configs });
            pushSuccess("Configuration created");
          }
        } else if (res.status === 409) {
          pushDanger("Config already exist");
        } else {
          pushDanger("Cannot create configuration");
        }
        return res;
      }
    );
  };

  const updateRadarrConfig = (id: string, config: IRadarrConfig) => {
    return put<IRadarrConfig>(APIRoutes.UPDATE_RADARR_CONFIG(id), config).then(
      (res) => {
        if (res.status === 200) {
          const configs = radarrConfigs.data;
          if (configs && res.data) {
            const index = configs.findIndex((c) => c.id === id);
            if (index !== -1) {
              configs.splice(index, 1, res.data);
              setRadarrConfigs({ ...radarrConfigs, data: configs });
              pushSuccess("Configuration updated");
            }
          }
        } else {
          pushDanger("Cannot update configuration");
        }
        return res;
      }
    );
  };

  const deleteRadarrConfig = (id: string) => {
    return remove(APIRoutes.DELETE_RADARR_CONFIG(id)).then((res) => {
      if (res.status === 204) {
        const configs = radarrConfigs.data;
        if (configs) {
          const index = configs.findIndex((c) => c.id === id);
          if (index !== -1) {
            configs.splice(index, 1);
            setRadarrConfigs({ ...radarrConfigs, data: configs });
            pushSuccess("Configuration deleted");
          }
        }
      } else {
        pushDanger("Cannot delete configuration");
      }
      return res;
    });
  };

  return {
    radarrConfigs,
    getRadarrInstanceInfo,
    createRadarrConfig,
    updateRadarrConfig,
    deleteRadarrConfig,
  };
};
