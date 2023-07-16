import { useEffect, useState } from "react";
import { IAsyncCall } from "../models/IAsyncCall";
import { useAPI } from "./useAPI";
import { APIRoutes } from "../enums/APIRoutes";
import { IProviderSettingsBase } from "../models/IProviderSettingsBase";
import { ISonarrInstanceInfo } from "../models/ISonarrInstanceInfo";
import { ISonarrConfig } from "../models/ISonarrConfig";
import { useAlert } from "../contexts/AlertContext";

export const useSonarrConfigs = () => {
  const [sonarrConfigs, setSonarrConfigs] = useState<
    IAsyncCall<ISonarrConfig[] | null>
  >({ data: [], status: -1, isLoading: true });

  const { get, post, put, remove } = useAPI();

  const { pushSuccess, pushDanger } = useAlert();

  useEffect(() => {
    get<ISonarrConfig[]>(APIRoutes.GET_SONARR_CONFIG).then((res) => {
      if (res.data) setSonarrConfigs(res);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getSonarrInstanceInfo = (
    config: IProviderSettingsBase,
    withAlert: boolean
  ) => {
    return post<ISonarrInstanceInfo>(
      APIRoutes.GET_SONARR_INSTANCE_INFO,
      config
    ).then((res) => {
      if (res.status === 200) {
        if (withAlert) {
          pushSuccess("Successful connection");
        }
      } else {
        pushDanger("Cannot get instance info");
      }
      return res;
    });
  };

  const createSonarrConfig = (config: ISonarrConfig) => {
    return post<ISonarrConfig>(APIRoutes.CREATE_SONARR_CONFIG, config).then(
      (res) => {
        if (res.status === 201 && res.data) {
          let configs = sonarrConfigs.data;
          if (configs) {
            configs.push(res.data);
            setSonarrConfigs({ ...sonarrConfigs, data: configs });
            pushSuccess("Configuration created");
          }
        } else {
          pushDanger("Cannot create configuration");
        }
        return res;
      }
    );
  };

  const updateSonarrConfig = (id: string, config: ISonarrConfig) => {
    return put<ISonarrConfig>(APIRoutes.UPDATE_SONARR_CONFIG(id), config).then(
      (res) => {
        if (res.status === 200 && res.data) {
          let configs = sonarrConfigs.data;
          if (configs) {
            let index = configs.findIndex((c) => c.id === id);
            if (index !== -1) {
              configs.splice(index, 1, res.data);
              setSonarrConfigs({ ...sonarrConfigs, data: configs });
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

  const deleteSonarrConfig = (id: string) => {
    remove(APIRoutes.DELETE_SONARR_CONFIG(id)).then((res) => {
      if (res.status === 204) {
        let configs = sonarrConfigs.data;
        if (configs) {
          let index = configs.findIndex((c) => c.id === id);
          if (index !== -1) {
            configs.splice(index, 1);
            setSonarrConfigs({ ...sonarrConfigs, data: configs });
            pushSuccess("Configuration deleted");
          }
        }
      } else {
        pushDanger("Cannot delete configuration");
      }
    });
  };

  return {
    sonarrConfigs,
    getSonarrInstanceInfo,
    createSonarrConfig,
    updateSonarrConfig,
    deleteSonarrConfig,
  };
};
