import { MediaTypes } from "../../../enums/MediaTypes";
import { isArrayOfStrings } from "../../../../utils/strings";

export interface IMediasServerMedias {
  readonly id: number;
  readonly type: MediaTypes;
  readonly title: string;
  readonly posterUrl: string;
  readonly artUrl: string;
  readonly summary: string;
  readonly releaseDate: Date;
  readonly isWatched: string;
  readonly rating: number;
  readonly webUrl: string[];
}

export const isMediaServerMedia = (arg: any): arg is IMediasServerMedias => {
  return (
    arg &&
    arg.id &&
    typeof arg.tmdbId == "number" &&
    arg.type &&
    typeof arg.type == "string" &&
    arg.title &&
    typeof arg.title == "string" &&
    arg.thumbUrl &&
    typeof arg.thumbUrl == "string" &&
    arg.artUrl &&
    typeof arg.artUrl == "string" &&
    arg.summary &&
    typeof arg.summary == "string" &&
    arg.releaseDate &&
    arg.releaseDate instanceof Date &&
    arg.isWatched &&
    typeof arg.isWatched == "boolean" &&
    arg.rating &&
    typeof arg.rating == "number" &&
    arg.webUrl &&
    isArrayOfStrings(arg.webUrl)
  );
};

interface IMediasGenres {
  name: string;
  role: string;
  posterUrl: string;
}

interface IMediasDirector {
  name: string;
  role: string;
  posterUrl: string;
}

interface IMediasStudio {
  name: string;
  role: string;
  posterUrl: string;
}

export interface IMediaServerMovie extends IMediasServerMedias {
  readonly duration: number;
  readonly actors: IActor[];
  readonly directors: IMediasDirector[];
  readonly studio: string[];
  readonly genres: IMediasGenres[];
}

export const isMediaServerMovie = (arg: any): arg is IMediaServerMovie => {
  return (
    arg &&
    arg.duration &&
    typeof arg.duration == "number" &&
    arg.directors &&
    isArrayOfStrings(arg.directors) &&
    arg.studio &&
    isArrayOfStrings(arg.studio) &&
    arg.genres &&
    isArrayOfStrings(arg.genres)
  );
};

export const isMediaServerMovieArray = (
  arg: any
): arg is IMediaServerMovie[] => {
  return arg && Array.isArray(arg) && arg.every((e) => isMediaServerMovie(e));
};

export interface IMediaServerSeries extends IMediasServerMedias {
  readonly seasons: IMediaServerSeason[];
  readonly actors: IActor[];
  readonly studios: IMediasStudio[];
  readonly genres: IMediasGenres[];
}

export const isMediaServerSeries = (arg: any): arg is IMediaServerSeries => {
  return (
    arg &&
    arg.seasons &&
    Array.isArray(arg.seasons) &&
    arg.studio &&
    isArrayOfStrings(arg.studio) &&
    arg.genres &&
    isArrayOfStrings(arg.genres)
  );
};

export const isMediaServerSeriesArray = (
  arg: any
): arg is IMediaServerSeries[] => {
  return arg && Array.isArray(arg) && arg.every((e) => isMediaServerSeries(e));
};

export interface IMediaServerSeason extends IMediasServerMedias {
  seriesId: number;
  seriesTitle: string;
  seasonNumber: number;
  episodes: IMediaServerEpisode[];
}

export const isMediaServerSeason = (arg: any): arg is IMediaServerSeason => {
  return arg && arg.type && arg.type === MediaTypes.SEASON;
};

export interface IMediaServerEpisode extends IMediasServerMedias {
  seriesId: number;
  seriesTitle: string;
  seasonNumber: number;
  episodeNumber: number;
  seasonThumbUrl: string;
  duration: number;
}

export const isMediaServerEpisode = (arg: any): arg is IMediaServerEpisode => {
  return arg && arg.type && arg.type === MediaTypes.EPISODE;
};

export interface IActor {
  name: string;
  posterUrl: string;
  role: string;
}
