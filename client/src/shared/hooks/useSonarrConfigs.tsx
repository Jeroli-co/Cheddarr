import { useAPI } from "./useAPI";
import { APIRoutes } from "../enums/APIRoutes";
import { IProviderSettingsBase } from "../models/IProviderSettingsBase";
import { ISonarrInstanceInfo } from "../models/ISonarrInstanceInfo";
import { ISonarrConfig } from "../models/ISonarrConfig";
import { useAlert } from "../contexts/AlertContext";
import { useQuery, useQueryClient } from "react-query";
import hoursToMilliseconds from "date-fns/hoursToMilliseconds";

const useData = () => {
  const { get } = useAPI();

  const fetchData = () => {
    return get<ISonarrConfig[]>(APIRoutes.GET_SONARR_CONFIG).then((res) => {
      if (res.status !== 200) {
        return undefined;
      } else {
        return res.data;
      }
    });
  };

  const { data, isLoading } = useQuery<ISonarrConfig[]>(
    [APIRoutes.GET_RADARR_CONFIG],
    fetchData,
    {
      staleTime: hoursToMilliseconds(1),
    },
  );

  return {
    data,
    isLoading,
  };
};
export const useSonarrConfigs = () => {
  const { post, put, remove } = useAPI();
  const { data, isLoading } = useData();
  const queryClient = useQueryClient();
  const { pushSuccess, pushDanger } = useAlert();

  const getSonarrInstanceInfo = (
    config: IProviderSettingsBase,
    withAlert: boolean,
  ) => {
    return post<ISonarrInstanceInfo>(
      APIRoutes.GET_SONARR_INSTANCE_INFO,
      config,
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
          queryClient.invalidateQueries(APIRoutes.GET_SONARR_INSTANCE_INFO);
        } else {
          pushDanger("Cannot create configuration");
        }
        return res;
      },
    );
  };

  const updateSonarrConfig = (id: string, config: ISonarrConfig) => {
    return put<ISonarrConfig>(APIRoutes.UPDATE_SONARR_CONFIG(id), config).then(
      (res) => {
        if (res.status === 200 && res.data) {
          queryClient.invalidateQueries(APIRoutes.GET_SONARR_INSTANCE_INFO);
        } else {
          pushDanger("Cannot update configuration");
        }
        return res;
      },
    );
  };

  const deleteSonarrConfig = (id: string) => {
    remove(APIRoutes.DELETE_SONARR_CONFIG(id)).then((res) => {
      if (res.status === 204) {
        queryClient.invalidateQueries(APIRoutes.GET_SONARR_INSTANCE_INFO);
      } else {
        pushDanger("Cannot delete configuration");
      }
    });
  };

  return {
    sonarrConfigs: data,
    isLoading,
    getSonarrInstanceInfo,
    createSonarrConfig,
    updateSonarrConfig,
    deleteSonarrConfig,
  };
};
