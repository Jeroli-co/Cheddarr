import { useEffect, useState } from "react";
import { SearchService } from "../services/SearchService";
import { ISearchedSeason } from "../models/ISearchedMedias";

export const useSeason = (tmdbId: number, seasonNumber: number) => {
  const [season, setSeason] = useState<ISearchedSeason | null>(null);
  useEffect(() => {
    SearchService.getSeasonByNumber(tmdbId, seasonNumber).then((res) => {
      if (res.error === null) setSeason(res.data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tmdbId, seasonNumber]);
  return season;
};
