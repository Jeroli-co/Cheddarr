import React, { createContext, useContext, useEffect, useState } from "react";
import {
  DefaultAsyncCall,
  IAsyncCall,
} from "../../../../shared/models/IAsyncCall";
import {
  compareRequestDefault,
  IMediaRequest,
  IMovieRequest,
  ISeriesRequest,
  isMovieRequest,
  isSeriesRequest,
} from "../models/IMediaRequest";
import { IRadarrConfig } from "../../settings/models/IRadarrConfig";
import { ISonarrConfig } from "../../settings/models/ISonarrConfig";
import { useRadarrConfig } from "../../../hooks/useRadarrConfig";
import { useSonarrConfig } from "../../../hooks/useSonarrConfig";
import { useRequests } from "../hooks/useRequests";
import { MediaTypes } from "../../../enums/MediaTypes";
import { RequestTypes } from "../enums/RequestTypes";
import { useAlert } from "../../../../shared/contexts/AlertContext";
import { RequestStatus } from "../enums/RequestStatus";
import { useAPI } from "../../../../shared/hooks/useAPI";
import { APIRoutes } from "../../../../shared/enums/APIRoutes";
import {
  DefaultAsyncData,
  IAsyncData,
} from "../../../../shared/models/IAsyncData";

interface RequestsContextInterface {
  radarrConfig: IAsyncCall<IRadarrConfig | null>;
  currentSonarrConfig: ISonarrConfig | null;
  requestsReceived: IAsyncData<IMediaRequest[] | null>;
  requestsSent: IAsyncData<IMediaRequest[] | null>;
  acceptRequest: (request: IMediaRequest) => void;
  refuseRequest: (request: IMediaRequest) => void;
  deleteRequest: (request: IMediaRequest) => void;
  sortRequests: (
    requestType: RequestTypes,
    compare: (first: IMediaRequest, second: IMediaRequest) => number
  ) => void;
}

export const RequestsContextDefaultImpl: RequestsContextInterface = {
  radarrConfig: DefaultAsyncCall,
  currentSonarrConfig: null,
  requestsReceived: DefaultAsyncData,
  requestsSent: DefaultAsyncData,
  acceptRequest(_: IMediaRequest): void {},
  refuseRequest(_: IMediaRequest): void {},
  deleteRequest(_: IMediaRequest): void {},
  sortRequests(
    rt: RequestTypes,
    c: (first: IMediaRequest, second: IMediaRequest) => number
  ): void {},
};

export const RequestsContext = createContext<RequestsContextInterface>(
  RequestsContextDefaultImpl
);

export const useRequestsContext = () => useContext(RequestsContext);

export const RequestsContextProvider = (props: any) => {
  const { radarrConfig } = useRadarrConfig();
  const { currentSonarrConfig } = useSonarrConfig();
  const { patch, remove } = useAPI();

  const {
    requests: moviesRequestsReceived,
    updateRequest: updateReceivedMovieRequest,
    deleteRequest: deleteReceivedMovie,
  } = useRequests(MediaTypes.MOVIES, RequestTypes.INCOMING);

  const {
    requests: seriesRequestsReceived,
    updateRequest: updateReceivedSeriesRequest,
    deleteRequest: deleteReceivedSeries,
  } = useRequests(MediaTypes.SERIES, RequestTypes.INCOMING);

  const {
    requests: moviesRequestsSent,
    updateRequest: updateSentMovieRequest,
    deleteRequest: deleteSentMovie,
  } = useRequests(MediaTypes.MOVIES, RequestTypes.OUTGOING);

  const {
    requests: seriesRequestsSent,
    updateRequest: updateSentSeriesRequest,
    deleteRequest: deleteSentSeries,
  } = useRequests(MediaTypes.SERIES, RequestTypes.OUTGOING);

  const [requestsReceived, setRequestsReceived] = useState<
    IAsyncData<IMediaRequest[] | null>
  >(DefaultAsyncData);

  const [requestsSent, setRequestsSent] = useState<
    IAsyncData<IMediaRequest[] | null>
  >(DefaultAsyncData);

  const { pushSuccess, pushDanger } = useAlert();

  useEffect(() => {
    if (moviesRequestsReceived.data && seriesRequestsReceived.data) {
      let data = [
        ...moviesRequestsReceived.data,
        ...seriesRequestsReceived.data,
      ];
      data = data.sort(compareRequestDefault);
      setRequestsReceived({
        data: data,
        isLoading: false,
      });
    } else if (
      (!moviesRequestsReceived.isLoading && !moviesRequestsReceived.data) ||
      (!seriesRequestsReceived.isLoading && !seriesRequestsReceived.data)
    ) {
      setRequestsReceived({ ...DefaultAsyncData, isLoading: false });
    }
  }, [moviesRequestsReceived, seriesRequestsReceived]);

  useEffect(() => {
    if (moviesRequestsSent.data && seriesRequestsSent.data) {
      let data = [...moviesRequestsSent.data, ...seriesRequestsSent.data];
      data = data.sort(compareRequestDefault);
      setRequestsSent({
        data: data,
        isLoading: false,
      });
    } else if (
      (!moviesRequestsSent.isLoading && !moviesRequestsSent.data) ||
      (!seriesRequestsSent.isLoading && !seriesRequestsSent.data)
    ) {
      setRequestsSent({ ...DefaultAsyncData, isLoading: false });
    }
  }, [moviesRequestsSent, seriesRequestsSent]);

  const acceptMovieRequest = (requestId: number) => {
    if (radarrConfig.data) {
      patch<IMovieRequest>(APIRoutes.UPDATE_REQUEST_MOVIE(requestId), {
        status: RequestStatus.APPROVED,
        providerId: radarrConfig.data.id,
      }).then((res) => {
        if (res.status === 200) {
          updateReceivedMovieRequest(requestId, RequestStatus.APPROVED);
          updateSentMovieRequest(requestId, RequestStatus.APPROVED);
          pushSuccess("Request accepted");
        } else {
          pushDanger("Cannot accept request, try again later...");
        }
      });
    }
  };

  const acceptSeriesRequest = (requestId: number) => {
    if (currentSonarrConfig.data) {
      patch<ISeriesRequest>(APIRoutes.UPDATE_REQUEST_SERIES(requestId), {
        status: RequestStatus.APPROVED,
        providerId: currentSonarrConfig.data.id,
      }).then((res) => {
        if (res.status === 200) {
          updateReceivedSeriesRequest(requestId, RequestStatus.APPROVED);
          updateSentSeriesRequest(requestId, RequestStatus.APPROVED);
          pushSuccess("Request accepted");
        } else {
          pushDanger("Cannot accept request, try again later...");
        }
      });
    }
  };

  const acceptRequest = (request: IMediaRequest) => {
    if (isMovieRequest(request)) {
      acceptMovieRequest(request.id);
    } else if (isSeriesRequest(request)) {
      acceptSeriesRequest(request.id);
    }
  };

  const refuseMovieRequest = (requestId: number) => {
    patch<IMovieRequest>(APIRoutes.UPDATE_REQUEST_MOVIE(requestId), {
      status: RequestStatus.REFUSED,
      providerId: null,
    }).then((res) => {
      if (res.status === 200) {
        updateReceivedMovieRequest(requestId, RequestStatus.REFUSED);
        updateSentMovieRequest(requestId, RequestStatus.REFUSED);
        pushSuccess("Request refused");
      } else {
        pushDanger("Cannot refused request, try again later...");
      }
    });
  };

  const refuseSeriesRequest = (requestId: number) => {
    patch<ISeriesRequest>(APIRoutes.UPDATE_REQUEST_SERIES(requestId), {
      status: RequestStatus.REFUSED,
      providerId: null,
    }).then((res) => {
      if (res.status === 200) {
        updateReceivedSeriesRequest(requestId, RequestStatus.REFUSED);
        updateSentSeriesRequest(requestId, RequestStatus.REFUSED);
        pushSuccess("Request refused");
      } else {
        pushDanger("Cannot refused request, try again later...");
      }
    });
  };

  const refuseRequest = (request: IMediaRequest) => {
    if (isMovieRequest(request)) {
      refuseMovieRequest(request.id);
    } else if (isSeriesRequest(request)) {
      refuseSeriesRequest(request.id);
    }
  };

  const deleteMovieRequest = (requestId: number) => {
    remove(APIRoutes.UPDATE_REQUEST_MOVIE(requestId)).then((res) => {
      if (res.status === 200) {
        deleteReceivedMovie(requestId);
        deleteSentMovie(requestId);
        pushSuccess("Request deleted");
      } else {
        pushDanger("Error deleting request");
      }
    });
  };

  const deleteSeriesRequest = (requestId: number) => {
    remove(APIRoutes.UPDATE_REQUEST_SERIES(requestId)).then((res) => {
      if (res.status === 200) {
        deleteReceivedSeries(requestId);
        deleteSentSeries(requestId);
        pushSuccess("Request deleted");
      } else {
        pushDanger("Error deleting request");
      }
    });
  };

  const deleteRequest = (request: IMediaRequest) => {
    if (isMovieRequest(request)) {
      deleteMovieRequest(request.id);
    } else if (isSeriesRequest(request)) {
      deleteSeriesRequest(request.id);
    }
  };

  const sortRequestReceived = (
    compare: (first: IMediaRequest, second: IMediaRequest) => number
  ) => {
    if (
      requestsReceived.data &&
      moviesRequestsReceived.data &&
      seriesRequestsReceived.data
    ) {
      setRequestsReceived({
        ...requestsReceived,
        data: requestsReceived.data?.sort(compare),
      });
    }
  };

  const sortRequestSent = (
    compare: (first: IMediaRequest, second: IMediaRequest) => number
  ) => {
    if (
      requestsSent.data &&
      moviesRequestsSent.data &&
      seriesRequestsSent.data
    ) {
      setRequestsSent({
        ...requestsSent,
        data: requestsSent.data?.sort(compare),
      });
    }
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

  return (
    <RequestsContext.Provider
      value={{
        radarrConfig,
        currentSonarrConfig: currentSonarrConfig.data,
        requestsReceived,
        requestsSent,
        acceptRequest,
        refuseRequest,
        deleteRequest,
        sortRequests,
      }}
    >
      {props.children}
    </RequestsContext.Provider>
  );
};
