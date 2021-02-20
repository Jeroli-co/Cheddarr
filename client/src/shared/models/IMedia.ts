import { MediaTypes, SeriesTypes } from "../enums/MediaTypes";

export interface IMedia {
  title: string;
  tmdbId: number;
  type: MediaTypes;
  releaseDate?: Date;
  status?: string;
  posterUrl?: string;
  artUrl?: string;
  summary?: string;
  rating?: number;
  duration?: number;
  studio?: string;
  genres?: string[];
  actors?: IPerson[];
  directors?: IPerson[];
  plexServerInfo?: PlexServerInfo;
}

export interface IMovie extends IMedia {}

export interface ISeries extends IMedia {
  tvdbId: number;
  numberOfSeasons: number;
  seriesType: SeriesTypes;
  seasons?: ISeason[];
}

export interface ISeason extends IMedia {
  seasonNumber: number;
  seriesId: number;
  seriesTitle: string;
  episodes?: IEpisode[];
}

export interface IEpisode extends IMedia {
  episodeNumber: number;
  seasonNumber: number;
  seriesId: number;
  seriesTitle: string;
}

export interface IPerson {
  name: string;
  role?: string;
  posterUrl?: string;
}

export interface PlexServerInfo {
  isWatched: boolean;
  addedAt: Date;
  webUrl: string;
}

export const isMedia = (arg: any): arg is IMedia => {
  return (
    arg &&
    arg.title &&
    typeof arg.title == "string" &&
    arg.tmdbId &&
    typeof arg.tmdbId == "number" &&
    arg.type &&
    Object.values(MediaTypes).includes(arg.type)
  );
};

export const isMovie = (arg: any): arg is IMovie => {
  return isMedia(arg);
};

export const isSeries = (arg: any): arg is ISeries => {
  return (
    arg.tvdbId &&
    typeof arg.tvdbId == "number" &&
    arg.numberOfSeasons &&
    typeof arg.numberOfSeasons == "number" &&
    arg.seriesType &&
    Object.values(SeriesTypes).includes(arg.seriesType) &&
    isMedia(arg)
  );
};

export const isSeason = (arg: any): arg is ISeason => {
  return (
    arg.seasonNumber &&
    typeof arg.seasonNumber == "number" &&
    arg.seriesId &&
    typeof arg.seriesId == "number" &&
    arg.seriesTitle &&
    typeof arg.seriesTitle == "string" &&
    isMedia(arg)
  );
};

export const isEpisode = (arg: any): arg is IEpisode => {
  return (
    arg.episodeNumber &&
    typeof arg.episodeNumber == "number" &&
    arg.seasonNumber &&
    typeof arg.seasonNumber == "number" &&
    arg.seriesId &&
    typeof arg.seriesId == "number" &&
    arg.seriesTitle &&
    typeof arg.seriesTitle == "string" &&
    isMedia(arg)
  );
};

export const isPerson = (arg: any): arg is IPerson => {
  return arg.name && typeof arg.name == "string";
};
