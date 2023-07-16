import React, { createContext, useContext } from "react";
import { DefaultAsyncCall, IAsyncCall } from "../models/IAsyncCall";
import { IMediaRequest } from "../models/IMediaRequest";
import { useRequests } from "../hooks/useRequests";
import { RequestTypes } from "../enums/RequestTypes";
import { useAlert } from "./AlertContext";
import { RequestStatus } from "../enums/RequestStatus";
import { useAPI } from "../hooks/useAPI";
import { APIRoutes } from "../enums/APIRoutes";
import { IPaginated } from "../models/IPaginated";
import { MediaTypes } from "../enums/MediaTypes";

interface RequestsContextInterface {
  requestsReceived: IAsyncCall<IPaginated<IMediaRequest> | null>;
  requestsSent: IAsyncCall<IPaginated<IMediaRequest> | null>;
  updateRequest: (
    mediaType: MediaTypes,
    providerId: string,
    requestId: number,
    requestStatus: RequestStatus
  ) => void;
  deleteRequest: (mediaType: MediaTypes, requestId: number) => void;
  sortRequests: (
    requestType: RequestTypes,
    compare: (first: IMediaRequest, second: IMediaRequest) => number
  ) => void;
  onLoadPrev: (requestType: RequestTypes) => void;
  onLoadNext: (requestType: RequestTypes) => void;
}

export const RequestsContextDefaultImpl: RequestsContextInterface = {
  requestsReceived: DefaultAsyncCall,
  requestsSent: DefaultAsyncCall,
  updateRequest(): void {},
  deleteRequest(): void {},
  sortRequests(): void {},
  onLoadNext(): void {},
  onLoadPrev(): void {},
};

export const RequestsContext = createContext<RequestsContextInterface>(
  RequestsContextDefaultImpl
);

export const useRequestsContext = () => useContext(RequestsContext);

export const RequestsContextProvider = (props: any) => {
  const { patch, remove } = useAPI();

  const {
    data: requestsReceived,
    updateRequest: updateReceivedRequest,
    deleteRequest: deleteReceivedRequest,
    sortRequests: sortRequestReceived,
    loadPrev: loadPrevRequestReceived,
    loadNext: loadNextRequestReceived,
  } = useRequests(RequestTypes.INCOMING);

  const {
    data: requestsSent,
    updateRequest: updateSentRequest,
    deleteRequest: deleteSentRequest,
    sortRequests: sortRequestSent,
    loadPrev: loadPrevRequestSent,
    loadNext: loadNextRequestSent,
  } = useRequests(RequestTypes.OUTGOING);

  const { pushSuccess, pushDanger } = useAlert();

  const updateUrl = (mediaType: MediaTypes, requestId: number) =>
    mediaType === MediaTypes.MOVIES
      ? APIRoutes.UPDATE_REQUEST_MOVIE(requestId)
      : APIRoutes.UPDATE_REQUEST_SERIES(requestId);

  const updateRequest = (
    mediaType: MediaTypes,
    providerId: string,
    requestId: number,
    requestStatus: RequestStatus
  ) => {
    patch<IMediaRequest>(updateUrl(mediaType, requestId), {
      status: requestStatus,
      providerId: providerId,
    }).then((res) => {
      if (res.status === 200) {
        updateReceivedRequest(requestId, requestStatus);
        updateSentRequest(requestId, requestStatus);
        pushSuccess("Request " + requestStatus);
      } else {
        pushDanger("Internal error, try again later...");
      }
    });
  };

  const deleteRequest = (mediaType: MediaTypes, requestId: number) => {
    remove(updateUrl(mediaType, requestId)).then((res) => {
      if (res.status === 204) {
        deleteReceivedRequest(requestId);
        deleteSentRequest(requestId);
        pushSuccess("Request deleted");
      } else {
        pushDanger("Error deleting request");
      }
    });
  };

  const sortRequests = (
    requestType: RequestTypes,
    compare: (first: IMediaRequest, second: IMediaRequest) => number
  ) => {
    if (requestType === RequestTypes.INCOMING) {
      sortRequestReceived(compare);
    } else {
      sortRequestSent(compare);
    }
  };

  const onLoadPrev = (requestType: RequestTypes) => {
    if (requestType === RequestTypes.OUTGOING) {
      loadPrevRequestSent();
    } else if (requestType === RequestTypes.INCOMING) {
      loadPrevRequestReceived();
    }
  };

  const onLoadNext = (requestType: RequestTypes) => {
    if (requestType === RequestTypes.OUTGOING) {
      loadNextRequestSent();
    } else if (requestType === RequestTypes.INCOMING) {
      loadNextRequestReceived();
    }
  };

  return (
    <RequestsContext.Provider
      value={{
        requestsReceived,
        requestsSent,
        updateRequest,
        deleteRequest,
        sortRequests,
        onLoadPrev,
        onLoadNext,
      }}
    >
      {props.children}
    </RequestsContext.Provider>
  );
};
