import { RequestStatus } from "../enums/RequestStatus";
import { IPublicUser } from "./IPublicUser";
import { IMedia, IMovie, ISeries } from "./IMedia";

export interface IMediaRequest {
  id: number;
  status: RequestStatus;
  requestedUser: IPublicUser;
  requestingUser: IPublicUser;
  createdAt: Date;
  updatedAt: Date;
  media: IMedia;
}

export interface IMovieRequest extends IMediaRequest {
  movie: IMovie;
}

export interface ISeriesRequest extends IMediaRequest {
  tvdbId: number;
  seriesType: string;
  series: ISeries;
  seasons: {
    seasonNumber: number;
    episodes: { episodeNumber: number }[];
  }[];
}

export const isMovieRequest = (arg: any): arg is IMovieRequest => {
  return arg;
};

export const isSeriesRequest = (arg: any): arg is ISeriesRequest => {
  return arg && arg.series;
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
  const titleFirst = first.media.title;
  const titleSecond = second.media.title;
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
  const titleFirst = first.media.title;
  const titleSecond = second.media.title;
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
  const typeFirst = first.media.mediaType;
  const typeSecond = second.media.mediaType;
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
  const typeFirst = first.media.mediaType;
  const typeSecond = second.media.mediaType;
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
