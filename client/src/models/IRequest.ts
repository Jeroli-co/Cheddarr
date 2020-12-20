import { RequestStatus } from "../enums/RequestStatus";
import { IPublicUser } from "./IPublicUser";
import {
  ISearchedMedias,
  ISearchedMovie,
  ISearchedSeries,
} from "./ISearchedMedias";
import { SeriesType } from "../enums/SeriesType";

export interface IRequest {
  readonly id: number;
  status: RequestStatus;
  readonly requestedUser: IPublicUser;
  readonly requestingUser: IPublicUser;
  readonly createdAt: Date;
  readonly updatedAt?: Date;
}

export interface IMovieRequest extends IRequest {
  readonly movie: ISearchedMovie;
}

export interface ISeriesRequest extends IRequest {
  readonly tvdbId: number;
  readonly seriesType: SeriesType;
  readonly series: ISearchedSeries;
  readonly seasons: {
    seasonNumber: number;
    episodes: { episodeNumber: number }[];
  }[];
}

export const isSeriesRequest = (arg: any): arg is ISeriesRequest => {
  return (
    arg &&
    arg.tvdbId &&
    typeof arg.tvdbId == "number" &&
    arg.seriesType &&
    typeof arg.seriesType == "string"
  );
};

export const isArrayOfSeriesRequest = (
  value: any
): value is ISeriesRequest[] => {
  return Array.isArray(value) && value.every((item) => isSeriesRequest(item));
};
