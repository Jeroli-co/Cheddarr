import { RequestStatus } from "../enums/RequestStatus";
import { IPublicUser } from "./IPublicUser";
import { ISearchedMovie, ISearchedSeries } from "./ISearchedMedias";

export interface IMediaRequest {
  readonly id: number;
  status: RequestStatus;
  readonly requestedUser: IPublicUser;
  readonly requestingUser: IPublicUser;
  readonly createdAt: Date;
  readonly updatedAt: Date;
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

export const isMovieRequest = (arg: any): arg is IMovieRequest => {
  return arg && arg.movie;
};

export const isSeriesRequest = (arg: any): arg is ISeriesRequest => {
  return arg && arg.series;
};

export const getPosterFromRequest = (request: IMediaRequest) => {
  return isMovieRequest(request)
    ? request.movie.posterUrl
    : isSeriesRequest(request)
    ? request.series.posterUrl
    : undefined;
};

export const getTitleFromRequest = (request: IMediaRequest) => {
  return isMovieRequest(request)
    ? request.movie.title
    : isSeriesRequest(request)
    ? request.series.title
    : undefined;
};

export const getMediaTypeFromRequest = (request: IMediaRequest) => {
  return isMovieRequest(request)
    ? request.movie.mediaType
    : isSeriesRequest(request)
    ? request.series.mediaType
    : undefined;
};

export const compareRequestDefault = (
  first: IMediaRequest,
  second: IMediaRequest
) => {
  const statusFirst = first.status;
  const statusSecond = second.status;
  if (statusFirst && statusSecond) {
    if (
      statusFirst === RequestStatus.PENDING &&
      statusSecond !== RequestStatus.PENDING
    ) {
      return -1;
    } else if (
      statusFirst !== RequestStatus.PENDING &&
      statusSecond === RequestStatus.PENDING
    ) {
      return 1;
    } else {
      return compareRequestCreationDateAsc(first, second);
    }
  }
  return 0;
};

export const compareRequestTitleDesc = (
  first: IMediaRequest,
  second: IMediaRequest
) => {
  const titleFirst = getTitleFromRequest(first);
  const titleSecond = getTitleFromRequest(second);
  if (titleFirst && titleSecond) {
    if (titleFirst < titleSecond) {
      return -1;
    } else if (titleFirst > titleSecond) {
      return 1;
    } else {
      return compareRequestDefault(first, second);
    }
  }
  return 0;
};

export const compareRequestTitleAsc = (
  first: IMediaRequest,
  second: IMediaRequest
) => {
  const titleFirst = getTitleFromRequest(first);
  const titleSecond = getTitleFromRequest(second);
  if (titleFirst && titleSecond) {
    if (titleFirst > titleSecond) {
      return -1;
    } else if (titleFirst < titleSecond) {
      return 1;
    } else {
      return compareRequestDefault(first, second);
    }
  }
  return 0;
};

export const compareRequestMediaTypeDesc = (
  first: IMediaRequest,
  second: IMediaRequest
) => {
  const typeFirst = getMediaTypeFromRequest(first);
  const typeSecond = getMediaTypeFromRequest(second);
  if (typeFirst && typeSecond) {
    if (typeFirst < typeSecond) {
      return -1;
    } else if (typeFirst > typeSecond) {
      return 1;
    } else {
      return compareRequestDefault(first, second);
    }
  }
  return 0;
};

export const compareRequestMediaTypeAsc = (
  first: IMediaRequest,
  second: IMediaRequest
) => {
  const typeFirst = getMediaTypeFromRequest(first);
  const typeSecond = getMediaTypeFromRequest(second);
  if (typeFirst && typeSecond) {
    if (typeFirst > typeSecond) {
      return -1;
    } else if (typeFirst < typeSecond) {
      return 1;
    } else {
      return compareRequestDefault(first, second);
    }
  }
  return 0;
};

export const compareRequestingUserDesc = (
  first: IMediaRequest,
  second: IMediaRequest
) => {
  const userFirst = first.requestingUser.username;
  const userSecond = second.requestingUser.username;
  if (userFirst && userSecond) {
    if (userFirst < userSecond) {
      return -1;
    } else if (userFirst > userSecond) {
      return 1;
    } else {
      return compareRequestDefault(first, second);
    }
  }
  return 0;
};

export const compareRequestingUserAsc = (
  first: IMediaRequest,
  second: IMediaRequest
) => {
  const userFirst = first.requestingUser.username;
  const userSecond = second.requestingUser.username;
  if (userFirst && userSecond) {
    if (userFirst > userSecond) {
      return -1;
    } else if (userFirst < userSecond) {
      return 1;
    } else {
      return compareRequestDefault(first, second);
    }
  }
  return 0;
};

export const compareRequestedUserDesc = (
  first: IMediaRequest,
  second: IMediaRequest
) => {
  const userFirst = first.requestedUser.username;
  const userSecond = second.requestedUser.username;
  if (userFirst && userSecond) {
    if (userFirst < userSecond) {
      return -1;
    } else if (userFirst > userSecond) {
      return 1;
    } else {
      return compareRequestDefault(first, second);
    }
  }
  return 0;
};

export const compareRequestedUserAsc = (
  first: IMediaRequest,
  second: IMediaRequest
) => {
  const userFirst = first.requestedUser.username;
  const userSecond = second.requestedUser.username;
  if (userFirst && userSecond) {
    if (userFirst > userSecond) {
      return -1;
    } else if (userFirst < userSecond) {
      return 1;
    } else {
      return compareRequestDefault(first, second);
    }
  }
  return 0;
};

export const compareRequestCreationDateDesc = (
  first: IMediaRequest,
  second: IMediaRequest
) => {
  const dateFirst = new Date(first.createdAt);
  const dateSecond = new Date(second.createdAt);
  if (dateFirst && dateSecond) {
    if (dateFirst < dateSecond) {
      return -1;
    } else if (dateFirst > dateSecond) {
      return 1;
    }
  }
  return 0;
};

export const compareRequestCreationDateAsc = (
  first: IMediaRequest,
  second: IMediaRequest
) => {
  const dateFirst = new Date(first.createdAt);
  const dateSecond = new Date(second.createdAt);
  if (dateFirst && dateSecond) {
    if (dateFirst > dateSecond) {
      return -1;
    } else if (dateFirst < dateSecond) {
      return 1;
    }
  }
  return 0;
};

export const compareRequestUpdatedDateDesc = (
  first: IMediaRequest,
  second: IMediaRequest
) => {
  const dateFirst = new Date(first.updatedAt);
  const dateSecond = new Date(second.updatedAt);
  if (dateFirst && dateSecond) {
    if (dateFirst < dateSecond) {
      return -1;
    } else if (dateFirst > dateSecond) {
      return 1;
    }
  }
  return 0;
};

export const compareRequestUpdatedDateAsc = (
  first: IMediaRequest,
  second: IMediaRequest
) => {
  const dateFirst = new Date(first.updatedAt);
  const dateSecond = new Date(second.updatedAt);
  if (dateFirst && dateSecond) {
    if (dateFirst > dateSecond) {
      return -1;
    } else if (dateFirst < dateSecond) {
      return 1;
    }
  }
  return 0;
};

export const compareRequestStatusDesc = (
  first: IMediaRequest,
  second: IMediaRequest
) => {
  const statusFirst = first.status;
  const statusSecond = second.status;
  if (statusFirst && statusSecond) {
    if (statusFirst < statusSecond) {
      return -1;
    } else if (statusFirst > statusSecond) {
      return 1;
    } else {
      return compareRequestDefault(first, second);
    }
  }
  return 0;
};

export const compareRequestStatusAsc = (
  first: IMediaRequest,
  second: IMediaRequest
) => {
  const statusFirst = first.status;
  const statusSecond = second.status;
  if (statusFirst && statusSecond) {
    if (statusFirst > statusSecond) {
      return -1;
    } else if (statusFirst < statusSecond) {
      return 1;
    } else {
      return compareRequestDefault(first, second);
    }
  }
  return 0;
};
