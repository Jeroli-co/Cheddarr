import { RequestTypes } from "../enums/RequestTypes";
import { IMediaRequest } from "../models/IMediaRequest";
import { RequestStatus } from "../enums/RequestStatus";
import { APIRoutes } from "../enums/APIRoutes";
import { usePagination } from "./usePagination";

export const useRequests = (requestsType: RequestTypes) => {
  const {
    data,
    loadPrev,
    loadNext,
    updateData,
    deleteData,
    sortData,
  } = usePagination<IMediaRequest>(APIRoutes.GET_REQUESTS(requestsType));

  const updateRequest = (requestId: number, requestStatus: RequestStatus) => {
    const findRequest = (r: IMediaRequest) => {
      return r.id === requestId;
    };
    const updateRequest = (r: IMediaRequest) => {
      r.status = requestStatus;
    };
    if (requestsType === RequestTypes.INCOMING) {
      updateData(findRequest, updateRequest);
    }
  };

  const deleteRequest = (requestId: number) => {
    const findRequest = (r: IMediaRequest) => {
      return r.id === requestId;
    };
    deleteData(findRequest);
  };

  const sortRequests = (
    compare: (first: IMediaRequest, second: IMediaRequest) => number
  ) => {
    sortData(compare);
  };

  return {
    data,
    loadPrev,
    loadNext,
    updateRequest,
    deleteRequest,
    sortRequests,
  };
};
