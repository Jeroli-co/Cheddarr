import { RequestStatus } from "../enums/RequestStatus";
import { IPublicUser } from "../../user/models/IPublicUser";
import {
  ISearchedMedias,
  ISearchedMovie,
  ISearchedSeries,
} from "../../search/models/ISearchedMedias";
import { SeriesType } from "../../media/enums/SeriesType";

export interface IRequest {
  readonly id: number;
  readonly status: RequestStatus;
  readonly requestedUser: IPublicUser;
  readonly requestingUser: IPublicUser;
  readonly medias: ISearchedMedias;
  readonly createdAt: Date;
  readonly updatedAt?: Date;
}

export interface IMovieRequest extends IRequest {
  readonly medias: ISearchedMovie;
}

export interface ISeriesRequest extends IRequest {
  readonly tvdbId: number;
  readonly seriesType: SeriesType;
  readonly medias: ISearchedSeries;
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
