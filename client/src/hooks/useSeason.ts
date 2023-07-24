import { useAPI } from "../shared/hooks/useAPI";
import { APIRoutes } from "../shared/enums/APIRoutes";
import { ISeason } from "../shared/models/IMedia";
import { useAlert } from "../shared/contexts/AlertContext";
import { useQuery } from "react-query";
import hoursToMilliseconds from "date-fns/hoursToMilliseconds";

export const useSeason = (seriesId: string, seasonNumber: number) => {
  const { get } = useAPI();
  const { pushDanger } = useAlert();

  const fetchSeason = () => {
    return get<ISeason>(APIRoutes.GET_SEASON(seriesId, seasonNumber)).then(
      (res) => {
        if (res.status !== 200) {
          pushDanger("Cannot get season");
          return undefined;
        } else {
          return res.data;
        }
      },
    );
  };

  const { data, isLoading } = useQuery<ISeason>(
    ["season", seriesId, seasonNumber],
    fetchSeason,
    {
      staleTime: hoursToMilliseconds(24),
    },
  );

  return {
    data,
    isLoading,
  };
};
