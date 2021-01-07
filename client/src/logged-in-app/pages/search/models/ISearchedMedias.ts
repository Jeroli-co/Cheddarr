import { MediaTypes } from "../../../enums/MediaTypes";

export interface ISearchedMedias {
  readonly tmdbId: number;
  readonly title: string;
  readonly posterUrl: string | null;
  readonly artUrl: string | null;
  readonly summary: string;
  readonly releaseDate: Date;
  readonly rating: number;
  readonly genres: string[];
  readonly mediaType: MediaTypes;
}

export interface ISearchedMovie extends ISearchedMedias {}

export interface ISearchedSeries extends ISearchedMedias {
  tvdbId: number;
  numberOfSeasons: number;
  seasons: ISearchedSeason[];
  seriesType: string;
}

export const isSearchedSeries = (arg: any): arg is ISearchedSeries => {
  return arg && arg.tvdbId && typeof arg.tvdbId == "number";
};

export interface ISearchedSeason {
  seasonNumber: number;
  title: string;
  releaseDate: Date;
  episodes: ISearchedEpisode[];
}

export interface ISearchedEpisode {
  episodeNumber: number;
  title: string;
  realeaseDate: Date;
}
