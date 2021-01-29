import React, { createContext, useContext } from "react";
import {
  DefaultAsyncCall,
  IAsyncCall,
} from "../../../../shared/models/IAsyncCall";
import { IMediaRequest } from "../models/IMediaRequest";
import { useRequests } from "../hooks/useRequests";
import { MediaTypes } from "../../../enums/MediaTypes";
import { RequestTypes } from "../enums/RequestTypes";
import { AlertContext } from "../../../../shared/contexts/AlertContext";
import { useAPI } from "../../../../shared/hooks/useAPI";
import { APIRoutes } from "../../../../shared/enums/APIRoutes";

interface RequestsSentContextInterface {
  moviesRequestsSent: IAsyncCall<IMediaRequest[] | null>;
  seriesRequestsSent: IAsyncCall<IMediaRequest[] | null>;
  deleteMovieRequestSent: (requestId: number) => void;
  deleteSeriesRequestSent: (requestId: number) => void;
}

export const RequestsSentContextDefaultImpl: RequestsSentContextInterface = {
  moviesRequestsSent: DefaultAsyncCall,
  seriesRequestsSent: DefaultAsyncCall,
  deleteMovieRequestSent(_: number): void {},
  deleteSeriesRequestSent(_: number): void {},
};

export const RequestsSentContext = createContext<RequestsSentContextInterface>(
  RequestsSentContextDefaultImpl
);

export const useRequestsSent = () => useContext(RequestsSentContext);

export const RequestsSentContextProvider = (props: any) => {
  const {
    requests: moviesRequestsSent,
    deleteRequest: deleteOutgoingMovie,
  } = useRequests(MediaTypes.MOVIES, RequestTypes.OUTGOING);

  const {
    requests: seriesRequestsSent,
    deleteRequest: deleteOutgoingSeries,
  } = useRequests(MediaTypes.SERIES, RequestTypes.OUTGOING);

  const { pushSuccess, pushDanger } = useContext(AlertContext);

  const { remove } = useAPI();

  const deleteMovieRequestSent = (requestId: number) => {
    remove(APIRoutes.UPDATE_REQUEST_MOVIE(requestId)).then((res) => {
      if (res.status === 200) {
        deleteOutgoingMovie(requestId);
        pushSuccess("Request deleted");
      } else {
        pushDanger("Error deleting request");
      }
    });
  };

  const deleteSeriesRequestSent = (requestId: number) => {
    remove(APIRoutes.UPDATE_REQUEST_SERIES(requestId)).then((res) => {
      if (res.status === 200) {
        deleteOutgoingSeries(requestId);
        pushSuccess("Request deleted");
      } else {
        pushDanger("Error deleting request");
      }
    });
  };

  return (
    <RequestsSentContext.Provider
      value={{
        moviesRequestsSent,
        seriesRequestsSent,
        deleteMovieRequestSent,
        deleteSeriesRequestSent,
      }}
    >
      {props.children}
    </RequestsSentContext.Provider>
  );
};
