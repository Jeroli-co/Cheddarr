import { useEffect, useState } from "react";
import { SearchService } from "../services/SearchService";
import { ISearchedSeason } from "../models/ISearchedMedias";

export const useSeason = (tvdbId: number, seasonNumber: number) => {
  const [season, setSeason] = useState<ISearchedSeason | null>(null);
  useEffect(() => {
    SearchService.GetSeasonByNumber(tvdbId, seasonNumber).then((res) => {
      if (res.error === null) setSeason(res.data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tvdbId, seasonNumber]);
  return season;
};
