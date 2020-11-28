import { useEffect, useState } from "react";
import { SearchService } from "../services/SearchService";
import { ISearchedEpisode } from "../models/ISearchedMedias";

export const useEpisode = (
  tmdbId: number,
  seasonNumber: number,
  episodeNumber: number
) => {
  const [episode, setEpisode] = useState<ISearchedEpisode | null>(null);
  useEffect(() => {
    SearchService.getEpisodeByNumber(tmdbId, seasonNumber, episodeNumber).then(
      (res) => {
        if (res.error === null) setEpisode(res.data);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tmdbId, seasonNumber, episodeNumber]);
  return episode;
};
