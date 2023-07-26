import { useAPI } from "../shared/hooks/useAPI";
import { useAlert } from "../shared/contexts/AlertContext";
import { IMovie } from "../shared/models/IMedia";
import { APIRoutes } from "../shared/enums/APIRoutes";
import { useQuery } from "react-query";
import hoursToMilliseconds from "date-fns/hoursToMilliseconds";

export const useMovie = (id: string) => {
  const { get } = useAPI();
  const { pushDanger } = useAlert();

  const fetchMovie = () => {
    return get<IMovie>(APIRoutes.GET_MOVIE(id)).then((res) => {
      if (res.status !== 200) {
        pushDanger("Cannot get movie");
        return undefined;
      } else {
        return res.data;
      }
    });
  };

  const { data, isLoading, error } = useQuery<IMovie>(
    ["movie", id],
    fetchMovie,
    {
      staleTime: hoursToMilliseconds(24),
    },
  );

  return {
    data,
    isLoading,
    error,
  };
};