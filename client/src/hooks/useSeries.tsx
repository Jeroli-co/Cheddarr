import { useEffect, useState } from "react";
import { MediasTypes } from "../enums/MediasTypes";
import { SearchService } from "../services/SearchService";
import { ISearchedSeries } from "../models/ISearchedMedias";

export const useSeries = (tvdbId: number) => {
  const [series, setSeries] = useState<ISearchedSeries | null>(null);

  useEffect(() => {
    SearchService.GetMediaById(MediasTypes.SERIES, tvdbId).then((res) => {
      if (res.error === null) setSeries(res.data as ISearchedSeries);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tvdbId]);

  return series;
};
