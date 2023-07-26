import { useAPI } from "../shared/hooks/useAPI";
import { APIRoutes } from "../shared/enums/APIRoutes";
import { IMedia, IMovie } from "../shared/models/IMedia";
import { MediaTypes } from "../shared/enums/MediaTypes";
import { useQuery } from "react-query";
import hoursToMilliseconds from "date-fns/hoursToMilliseconds";

export const useMedia = (type: MediaTypes, id: string) => {
  const { get } = useAPI();

  const fetchMedia = () => {
    return get<IMedia>(
      type === MediaTypes.MOVIES
        ? APIRoutes.GET_MOVIE(id)
        : APIRoutes.GET_SERIES(id),
    ).then((res) => {
      if (res.status !== 200) {
        return undefined;
      }

      return res.data;
    });
  };

  const { data, isLoading, error } = useQuery<IMovie>(
    [type === MediaTypes.MOVIES ? "movie" : "series", id],
    fetchMedia,
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
