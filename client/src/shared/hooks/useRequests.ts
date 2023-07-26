import { RequestTypes } from "../enums/RequestTypes";
import { IMediaRequest } from "../models/IMediaRequest";
import { APIRoutes } from "../enums/APIRoutes";
import { usePagination } from "./usePagination";

export const useRequests = (requestsType: RequestTypes) => {
  const { data, loadPrev, loadNext, invalidate, sortData, isLoading } =
    usePagination<IMediaRequest>(APIRoutes.GET_REQUESTS(requestsType));

  const sortRequests = (
    compare: (first: IMediaRequest, second: IMediaRequest) => number,
  ) => {
    sortData(compare);
  };

  return {
    data,
    loadPrev,
    loadNext,
    updateRequest: invalidate,
    deleteRequest: invalidate,
    sortRequests,
    isLoading,
  };
};
