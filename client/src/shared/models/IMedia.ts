import { MediaTypes, SeriesTypes } from "../enums/MediaTypes";

export interface IMedia {
  title: string;
  tmdbId: string;
  mediaType: MediaTypes;
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
  trailers?: { videoUrl: string }[];
}

export interface IMovie extends IMedia {}

export interface ISeries extends IMedia {
  numberOfSeasons?: number;
  seriesType?: SeriesTypes;
  seasons?: ISeason[];
}

export interface ISeason extends IMedia {
  seasonNumber: number;
  episodes?: IEpisode[];
}

export interface IEpisode extends IMedia {
  episodeNumber: number;
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
    typeof arg.tmdbId == "number"
  );
};

export const isMovie = (arg: any): arg is IMovie => {
  return (
    arg &&
    arg.title &&
    typeof arg.title == "string" &&
    arg.tmdbId &&
    typeof arg.tmdbId == "number" &&
    arg.mediaType &&
    arg.mediaType === MediaTypes.MOVIES
  );
};

export const isSeries = (arg: any): arg is ISeries => {
  return (
    arg &&
    arg.title &&
    typeof arg.title == "string" &&
    arg.tmdbId &&
    typeof arg.tmdbId == "number" &&
    arg.mediaType &&
    arg.mediaType === MediaTypes.SERIES
  );
};

export const isSeason = (arg: any): arg is ISeason => {
  return arg && arg.seasonNumber && typeof arg.seasonNumber == "number";
};

export const isEpisode = (arg: any): arg is IEpisode => {
  return arg && arg.episodeNumber && typeof arg.episodeNumber == "number";
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

export const isMovieOrSeries = (media: IMedia): boolean => {
  return (
    media.mediaType === MediaTypes.MOVIES ||
    media.mediaType === MediaTypes.SERIES
  );
};

export const isMovieOrEpisode = (media: IMedia): boolean => {
  return media.mediaType === MediaTypes.MOVIES || isEpisode(media);
};
