import { RequestTypes } from "../enums/RequestTypes";
import { IMediaRequest } from "../models/IMediaRequest";
import { APIRoutes } from "../enums/APIRoutes";
import { PaginationHookProps, usePagination } from "./usePagination";

const useRequests = (
  requestsType: RequestTypes,
): PaginationHookProps<IMediaRequest> => {
  return usePagination<IMediaRequest>(APIRoutes.GET_REQUESTS(requestsType));
};

export const useIncomingRequest = () => useRequests(RequestTypes.INCOMING);
export const useOutgoingRequest = () => useRequests(RequestTypes.OUTGOING);
