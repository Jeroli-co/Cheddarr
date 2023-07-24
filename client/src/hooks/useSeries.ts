import { useAPI } from "../shared/hooks/useAPI";
import { APIRoutes } from "../shared/enums/APIRoutes";
import { ISeries } from "../shared/models/IMedia";
import { useAlert } from "../shared/contexts/AlertContext";
import { useQuery } from "react-query";
import hoursToMilliseconds from "date-fns/hoursToMilliseconds";

export const useSeries = (id: string) => {
  const { get } = useAPI();
  const { pushDanger } = useAlert();

  const fetchSeries = () => {
    return get<ISeries>(APIRoutes.GET_SERIES(id)).then((res) => {
      if (res.status !== 200) {
        pushDanger("Cannot get series");
        return undefined;
      } else {
        return res.data;
      }
    });
  };

  const { data, isLoading } = useQuery<ISeries>(["series", id], fetchSeries, {
    staleTime: hoursToMilliseconds(24),
  });

  return {
    data,
    isLoading,
  };
};
