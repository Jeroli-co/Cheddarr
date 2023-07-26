import { IRadarrConfig } from "../models/IRadarrConfig";
import { useAPI } from "./useAPI";
import { APIRoutes } from "../enums/APIRoutes";
import { useAlert } from "../contexts/AlertContext";
import { IProviderSettingsBase } from "../models/IProviderSettingsBase";
import { IRadarrInstanceInfo } from "../models/IRadarrInstanceInfo";
import { useQuery, useQueryClient } from "react-query";
import hoursToMilliseconds from "date-fns/hoursToMilliseconds";

const useData = () => {
  const { get } = useAPI();

  const fetchData = () => {
    return get<IRadarrConfig[]>(APIRoutes.GET_RADARR_CONFIG).then((res) => {
      if (res.status !== 200) {
        return undefined;
      } else {
        return res.data;
      }
    });
  };

  const { data, isLoading } = useQuery<IRadarrConfig[]>(
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

export const useRadarrConfigs = () => {
  const { put, post, remove } = useAPI();
  const { data, isLoading } = useData();
  const queryClient = useQueryClient();
  const { pushSuccess, pushDanger } = useAlert();

  const getRadarrInstanceInfo = (
    config: IProviderSettingsBase,
    withAlert: boolean,
  ) => {
    return post<IRadarrInstanceInfo>(
      APIRoutes.GET_RADARR_INSTANCE_INFO,
      config,
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
        if (res.status === 201) {
          queryClient.invalidateQueries(APIRoutes.GET_RADARR_INSTANCE_INFO);
        } else if (res.status === 409) {
          pushDanger("Config already exist");
        } else {
          pushDanger("Cannot create configuration");
        }
        return res;
      },
    );
  };

  const updateRadarrConfig = (id: string, config: IRadarrConfig) => {
    return put<IRadarrConfig>(APIRoutes.UPDATE_RADARR_CONFIG(id), config).then(
      (res) => {
        if (res.status === 200) {
          queryClient.invalidateQueries(APIRoutes.GET_RADARR_INSTANCE_INFO);
        } else {
          pushDanger("Cannot update configuration");
        }
        return res;
      },
    );
  };

  const deleteRadarrConfig = (id: string) => {
    return remove(APIRoutes.DELETE_RADARR_CONFIG(id)).then((res) => {
      if (res.status === 204) {
        queryClient.invalidateQueries(APIRoutes.GET_RADARR_INSTANCE_INFO);
      } else {
        pushDanger("Cannot delete configuration");
      }
      return res;
    });
  };

  return {
    radarrConfigs: data,
    isLoading,
    getRadarrInstanceInfo,
    createRadarrConfig,
    updateRadarrConfig,
    deleteRadarrConfig,
  };
};
