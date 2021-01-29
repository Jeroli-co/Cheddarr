import { useEffect, useState } from "react";
import { DefaultAsyncCall, IAsyncCall } from "../../shared/models/IAsyncCall";
import { useAPI } from "../../shared/hooks/useAPI";
import { APIRoutes } from "../../shared/enums/APIRoutes";
import { DefaultAsyncData, IAsyncData } from "../../shared/models/IAsyncData";
import { IProviderConfigBase } from "../pages/settings/models/IProviderConfigBase";
import { ISonarrInstanceInfo } from "../pages/settings/models/ISonarrInstanceInfo";
import { ISonarrConfig } from "../pages/settings/models/ISonarrConfig";
import { useAlert } from "../../shared/contexts/AlertContext";

export const useSonarrConfig = () => {
  const [sonarrConfigs, setSonarrConfigs] = useState<
    IAsyncCall<ISonarrConfig[] | null>
  >(DefaultAsyncCall);
  const [currentSonarrConfig, setCurrentSonarrConfig] = useState<
    IAsyncData<ISonarrConfig | null>
  >(DefaultAsyncData);

  const { get, post, put } = useAPI();

  const { pushSuccess, pushDanger } = useAlert();

  useEffect(() => {
    get<ISonarrConfig[]>(APIRoutes.GET_SONARR_CONFIG).then((res) => {
      if (res.data) {
        setSonarrConfigs(res);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (sonarrConfigs.data && sonarrConfigs.data.length > 0) {
      setCurrentSonarrConfig({ data: sonarrConfigs.data[0], isLoading: false });
    } else {
      setCurrentSonarrConfig({ data: null, isLoading: false });
    }
  }, [sonarrConfigs]);

  const getSonarrInstanceInfo = (
    config: IProviderConfigBase,
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
    post<ISonarrConfig>(APIRoutes.CREATE_SONARR_CONFIG, config).then((res) => {
      if (res.status === 201 && res.data) {
        let data = sonarrConfigs.data;
        if (data) {
          data.push(res.data);
          setSonarrConfigs({ ...sonarrConfigs, data: data });
          pushSuccess("Configuration created");
        }
      } else {
        pushDanger("Cannot create configuration");
      }
    });
  };

  const updateSonarrConfig = (id: string, config: ISonarrConfig) => {
    put<ISonarrConfig>(APIRoutes.UPDATE_SONARR_CONFIG(id), config).then(
      (res) => {
        if (res.status === 200 && res.data) {
          let data = sonarrConfigs.data;
          if (data) {
            let index = data.findIndex((c) => c.id === id);
            if (index !== -1) {
              data.splice(index, 1, res.data);
              setSonarrConfigs({ ...sonarrConfigs, data: data });
              pushSuccess("Configuration updated");
            }
          }
        } else {
          pushDanger("Cannot update configuration");
        }
      }
    );
  };

  return {
    sonarrConfigs,
    currentSonarrConfig,
    getSonarrInstanceInfo,
    createSonarrConfig,
    updateSonarrConfig,
  };
};
