import { DefaultAsyncCall, IAsyncCall } from "../models/IAsyncCall";
import { IMedia, isMovieOrSeries } from "../models/IMedia";
import { useEffect, useState } from "react";
import { useAPI } from "./useAPI";
import { APIRoutes } from "../enums/APIRoutes";
import { MediaTypes } from "../enums/MediaTypes";
import { IPaginated } from "../models/IPaginated";

export const useRecommendedMedia = (media: IMedia) => {
  const [recommendedMedia, setRecommendedMedia] = useState<
    IAsyncCall<IPaginated<IMedia> | null>
  >(DefaultAsyncCall);
  const { get } = useAPI();

  useEffect(() => {
    if (isMovieOrSeries(media)) {
      const url =
        media.mediaType === MediaTypes.MOVIES
          ? APIRoutes.GET_RECOMMENDED_MOVIES(media.tmdbId)
          : APIRoutes.GET_RECOMMENDED_SERIES(media.tmdbId);
      get<IPaginated<IMedia>>(url).then((res) => {
        if (res.status === 200) {
          setRecommendedMedia(res);
        } else {
          setRecommendedMedia({ ...DefaultAsyncCall, isLoading: false });
        }
      });
    } else {
      setRecommendedMedia({ ...DefaultAsyncCall, isLoading: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return recommendedMedia;
};