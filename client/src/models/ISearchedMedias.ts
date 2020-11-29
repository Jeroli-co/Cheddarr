import { MediasTypes } from "../enums/MediasTypes";
import { SeriesType } from "../enums/SeriesType";

export interface ISearchedMedias {
  readonly tmdbId: number;
  readonly title: string;
  readonly thumbUrl: string;
  readonly artUrl: string;
  readonly summary: string;
  readonly releaseDate: Date;
  readonly rating: number;
  readonly contentRating: string;
  readonly genres: string[];
  readonly type: MediasTypes;
}

export interface ISearchedMovie extends ISearchedMedias {}

export interface ISearchedSeries extends ISearchedMedias {
  tvdbId: number;
  numberOfSeasons: number;
  seasons: ISearchedSeason[];
  seriesType: SeriesType;
}

export const isSearchedSeries = (arg: any): arg is ISearchedSeries => {
  return (
    arg &&
    arg.tvdbId &&
    typeof arg.tvdbId == "string" &&
    arg.numberOfSeasons &&
    typeof arg.numberOfSeasons == "number"
  );
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
