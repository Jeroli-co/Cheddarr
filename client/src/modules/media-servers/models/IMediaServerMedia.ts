import { MediasTypes } from "../../media/enums/MediasTypes";
import { isArrayOfStrings } from "../../../utils/strings";

export interface IMediaServerMedia {
  readonly id: number;
  readonly type: MediasTypes;
  readonly title: string;
  readonly thumbUrl: string;
  readonly artUrl: string;
  readonly summary: string;
  readonly releaseDate: Date;
  readonly isWatched: string;
  readonly rating: number;
  readonly contentRating: string;
  readonly webUrl: string[];
}

export const isMediaServerMedia = (arg: any): arg is IMediaServerMedia => {
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
    arg.contentRating &&
    typeof arg.contentRating == "string" &&
    arg.webUrl &&
    isArrayOfStrings(arg.webUrl)
  );
};

export interface IMediaServerMovie extends IMediaServerMedia {
  readonly duration: number;
  readonly actors: IActor[];
  readonly directors: string[];
  readonly studio: string[];
  readonly genres: string[];
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

export interface IMediaServerSeries extends IMediaServerMedia {
  readonly seasons: IMediaServerSeason[];
  readonly actors: IActor[];
  readonly studio: string[];
  readonly genres: string[];
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

export interface IMediaServerSeason extends IMediaServerMedia {
  seriesId: number;
  seriesTitle: string;
  seasonNumber: number;
  episodes: IMediaServerEpisode[];
}

export const isMediaServerSeason = (arg: any): arg is IMediaServerSeason => {
  return (
    arg &&
    arg.seriesId &&
    typeof arg.seriesId == "number" &&
    arg.seriesTitle &&
    typeof arg.seriesTitle == "string" &&
    arg.seasonNumber &&
    typeof arg.seasonNumber == "number" &&
    arg.episodes &&
    Array.isArray(arg.episodes)
  );
};

export interface IMediaServerEpisode extends IMediaServerMedia {
  seriesId: number;
  seriesTitle: string;
  seasonNumber: number;
  episodeNumber: number;
  seasonThumbUrl: string;
  duration: number;
}

export const isMediaServerEpisode = (arg: any): arg is IMediaServerEpisode => {
  return (
    arg &&
    arg.seriesId &&
    typeof arg.seriesId == "number" &&
    arg.seriesTitle &&
    typeof arg.seriesTitle == "string" &&
    arg.seasonNumber &&
    typeof arg.seasonNumber == "number" &&
    arg.episodeNumber &&
    typeof arg.episodeNumber == "number" &&
    arg.seasonThumbUrl &&
    typeof arg.seasonThumbUrl == "string" &&
    arg.duration &&
    typeof arg.duration == "number"
  );
};

export interface IActor {
  name: string;
  thumbUrl: string;
  role: string;
}
