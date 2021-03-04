import React, { createContext, useContext, useState } from "react";
import { IRequestSeriesOptions } from "../models/IRequestSeriesOptions";

interface ISeriesRequestOptionsContext {
  options: IRequestSeriesOptions;
  addSeason: (seasonNumber: number) => void;
  removeSeason: (seasonNumber: number) => void;
  isSeasonSelected: (seasonNumber: number) => boolean;
  addEpisode: (seasonNumber: number, episodeNumber: number) => void;
  removeEpisode: (seasonNumber: number, episodeNumber: number) => void;
  isEpisodeSelected: (seasonNumber: number, episodeNumber: number) => boolean;
}

const SeriesRequestOptionsContextDefaultImpl: ISeriesRequestOptionsContext = {
  options: { seasons: [] },
  addEpisode(seasonNumber: number, episodeNumber: number): void {},
  addSeason(seasonNumber: number): void {},
  isEpisodeSelected(seasonNumber: number, episodeNumber: number): boolean {
    return false;
  },
  isSeasonSelected(seasonNumber: number): boolean {
    return false;
  },
  removeEpisode(seasonNumber: number, episodeNumber: number): void {},
  removeSeason(seasonNumber: number): void {},
};

const SeriesRequestOptionsContext = createContext<ISeriesRequestOptionsContext>(
  SeriesRequestOptionsContextDefaultImpl
);

export const useSeriesRequestOptionsContext = () =>
  useContext(SeriesRequestOptionsContext);

export const SeriesRequestOptionsContextProvider = (props: any) => {
  const [options, setOptions] = useState<IRequestSeriesOptions>({
    seasons: [],
  });

  const addSeason = (seasonNumber: number) => {
    const seasonIndex = options.seasons.findIndex(
      (s) => s.seasonNumber === seasonNumber
    );

    let optionsTemp = options;
    if (seasonIndex === -1) {
      optionsTemp.seasons.push({ seasonNumber: seasonNumber, episodes: [] });
    } else {
      optionsTemp.seasons[seasonIndex].episodes = [];
    }
    setOptions({ ...optionsTemp });
  };

  const removeSeason = (seasonNumber: number) => {
    console.log(seasonNumber);
    const seasons = options.seasons.filter(
      (s) => s.seasonNumber !== seasonNumber
    );
    setOptions({ seasons: seasons });
  };

  const addEpisode = (seasonNumber: number, episodeNumber: number) => {
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
    const seasons = options.seasons.find(
      (season) =>
        season.seasonNumber === seasonNumber && season.episodes.length === 0
    );
    return seasons !== undefined;
  };

  const isEpisodeSelected = (seasonNumber: number, episodeNumber: number) => {
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

  return (
    <SeriesRequestOptionsContext.Provider
      value={{
        options,
        addSeason,
        removeSeason,
        isSeasonSelected,
        addEpisode,
        removeEpisode,
        isEpisodeSelected,
      }}
    >
      {props.children}
    </SeriesRequestOptionsContext.Provider>
  );
};
