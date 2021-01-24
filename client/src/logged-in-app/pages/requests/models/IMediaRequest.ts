import { RequestStatus } from "../enums/RequestStatus";
import { IPublicUser } from "../../../models/IPublicUser";
import {
  ISearchedMovie,
  ISearchedSeries,
} from "../../search/models/ISearchedMedias";

export interface IMediaRequest {
  readonly id: number;
  status: RequestStatus;
  readonly requestedUser: IPublicUser;
  readonly requestingUser: IPublicUser;
  readonly createdAt: Date;
  readonly updatedAt?: Date;
}

export interface IMovieRequest extends IMediaRequest {
  readonly movie: ISearchedMovie;
}

export interface ISeriesRequest extends IMediaRequest {
  readonly tvdbId: number;
  readonly seriesType: string;
  readonly series: ISearchedSeries;
  readonly seasons: {
    seasonNumber: number;
    episodes: { episodeNumber: number }[];
  }[];
}

export const isSeriesRequest = (arg: any): arg is ISeriesRequest => {
  return arg && arg.tvdbId && typeof arg.tvdbId == "number";
};

export const isArrayOfSeriesRequest = (
  value: any
): value is ISeriesRequest[] => {
  return Array.isArray(value) && value.every((item) => isSeriesRequest(item));
};
