import { MediaTypes, SeriesTypes } from "../enums/MediaTypes";

export interface IMedia {
  title: string;
  mediaType: MediaTypes;
  tmdbId: number;
  tvdbId?: number;
  imdbId?: string;
  releaseDate?: string;
  status?: string;
  posterUrl?: string;
  artUrl?: string;
  summary?: string;
  rating?: number;
  duration?: number;
  studios?: { name: string }[];
  genres?: string[];
  credits?: {
    cast?: IPerson[];
    crew?: IPerson[];
  };
  mediaServerInfo?: MediaServerInfo[];
}

export interface IMovie extends IMedia {}

export interface ISeries extends IMedia {
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
  pictureUrl?: string;
}

export interface MediaServerInfo {
  externalMediaId: string;
  serverId: string;
  addedAt: Date;
  webUrl?: string;
}

export const isMedia = (arg: any): arg is IMedia => {
  return (
    arg &&
    arg.title &&
    typeof arg.title == "string" &&
    arg.tmdbId &&
    typeof arg.tmdbId == "number" &&
    arg.mediaType &&
    Object.values(MediaTypes).includes(arg.mediaType)
  );
};

export const isMovie = (arg: any): arg is IMovie => {
  return isMedia(arg);
};

export const isSeries = (arg: any): arg is ISeries => {
  return (
    arg &&
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

export const isOnServers = (media: IMedia): boolean => {
  return (
    media &&
    media.mediaServerInfo !== undefined &&
    media.mediaServerInfo.length > 0
  );
};
