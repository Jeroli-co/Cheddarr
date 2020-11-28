import { useEffect, useState } from "react";
import { ISearchedSeries } from "../../search/models/ISearchedMedias";
import { IRequestSeriesOptions } from "../models/IRequestSeriesOptions";

const useRequestSeriesOptions = (series: ISearchedSeries) => {
  const [options, setOptions] = useState<IRequestSeriesOptions | null>(null);

  useEffect(() => {
    setOptions({ seasons: [] });
  }, [series]);

  const addSeasons = (seasonNumber: number) => {
    if (!options) return null;
    const season = series.seasons.find(
      (season) => season.seasonNumber === seasonNumber
    );
    if (season) {
      if (options.seasons.length === 0) {
        options.seasons.push({ seasonNumber: seasonNumber, episodes: [] });
      } else {
        const isRequestContainSeason =
          options.seasons.find(
            (s) => s.seasonNumber === season.seasonNumber
          ) !== undefined;
        if (isRequestContainSeason) {
          season.episodes = [];
        } else {
          options.seasons.push({ seasonNumber: seasonNumber, episodes: [] });
        }
      }
      setOptions(options);
    }
  };

  const removeSeasons = (seasonNumber: number) => {
    if (!options) return null;
    const seasons = options.seasons.filter(
      (season) => season.seasonNumber !== seasonNumber
    );
    setOptions({ seasons: seasons });
  };

  const addEpisode = (seasonNumber: number, episodeNumber: number) => {
    if (!options) return null;
    const seasons = options.seasons;
    const season = seasons.find((s) => s.seasonNumber === seasonNumber);
    if (season) {
      season.episodes.push({ episodeNumber: episodeNumber });
    } else {
      seasons.push({
        seasonNumber: seasonNumber,
        episodes: [{ episodeNumber: episodeNumber }],
      });
    }
    setOptions({ seasons: seasons });
  };

  const removeEpisode = (seasonNumber: number, episodeNumber: number) => {
    if (!options) return null;
    const seasons = options.seasons;
    let seasonToDeleteIndex = -1;
    seasons.forEach((season, index) => {
      if (season.seasonNumber === seasonNumber) {
        season.episodes = season.episodes.filter(
          (e) => e.episodeNumber !== episodeNumber
        );
        if (season.episodes.length === 0) {
          seasonToDeleteIndex = index;
        }
      }
    });
    if (seasonToDeleteIndex >= 0) {
      seasons.splice(seasonToDeleteIndex, 1);
    }
    setOptions({ seasons: seasons });
  };

  const isSeasonSelected = (seasonNumber: number) => {
    if (!options) return false;
    const season = options.seasons.find(
      (season) =>
        season.seasonNumber === seasonNumber && season.episodes.length === 0
    );
    return season !== undefined;
  };

  const isEpisodeSelected = (seasonNumber: number, episodeNumber: number) => {
    if (!options) return false;
    const season = options.seasons.find(
      (season) => season.seasonNumber === seasonNumber
    );
    if (season) {
      const episode = season.episodes.find(
        (e) => e.episodeNumber === episodeNumber
      );
      return episode !== undefined;
    }
    return false;
  };

  return {
    options,
    addSeasons,
    removeSeasons,
    addEpisode,
    removeEpisode,
    isSeasonSelected,
    isEpisodeSelected,
  };
};

export { useRequestSeriesOptions };
