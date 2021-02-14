import { useEffect, useState } from "react";
import { ISearchedSeries } from "../models/ISearchedMedias";
import { useSearchMediaService } from "./useSearchMediaService";
import { DefaultAsyncCall, IAsyncCall } from "../models/IAsyncCall";

export const useSearchedSeries = (tvdbId: number) => {
  const [series, setSeries] = useState<IAsyncCall<ISearchedSeries | null>>(
    DefaultAsyncCall
  );
  const { getSeriesById } = useSearchMediaService();

  useEffect(() => {
    getSeriesById(tvdbId).then((res) => setSeries(res));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tvdbId]);

  return series;
};