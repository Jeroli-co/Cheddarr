import React, { createContext, useContext } from "react";
import {
  DefaultAsyncCall,
  IAsyncCall,
} from "../../../../shared/models/IAsyncCall";
import {
  IMediaRequest,
  IMovieRequest,
  ISeriesRequest,
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

interface RequestsReceivedContextInterface {
  radarrConfig: IAsyncCall<IRadarrConfig | null>;
  currentSonarrConfig: ISonarrConfig | null;
  moviesRequestsReceived: IAsyncCall<IMediaRequest[] | null>;
  seriesRequestsReceived: IAsyncCall<IMediaRequest[] | null>;
  acceptMovieRequest: (requestId: number) => void;
  refuseMovieRequest: (requestId: number) => void;
  acceptSeriesRequest(requestId: number): void;
  refuseSeriesRequest(requestId: number): void;
  deleteMovieRequestReceived: (requestId: number) => void;
  deleteSeriesRequestReceived: (requestId: number) => void;
}

export const RequestsReceivedContextDefaultImpl: RequestsReceivedContextInterface = {
  radarrConfig: DefaultAsyncCall,
  currentSonarrConfig: null,
  moviesRequestsReceived: DefaultAsyncCall,
  seriesRequestsReceived: DefaultAsyncCall,
  acceptMovieRequest(_: number): void {},
  refuseMovieRequest(_: number): void {},
  acceptSeriesRequest(_: number): void {},
  refuseSeriesRequest(_: number): void {},
  deleteMovieRequestReceived(_: number): void {},
  deleteSeriesRequestReceived(_: number): void {},
};

export const RequestsReceivedContext = createContext<
  RequestsReceivedContextInterface
>(RequestsReceivedContextDefaultImpl);

export const useRequestsReceived = () => useContext(RequestsReceivedContext);

export const RequestsReceivedContextProvider = (props: any) => {
  const { radarrConfig } = useRadarrConfig();
  const { currentSonarrConfig } = useSonarrConfig();
  const { patch, remove } = useAPI();

  const {
    requests: moviesRequestsReceived,
    updateRequest: updateReceivedMovieRequest,
    deleteRequest: deleteIncomingMovie,
  } = useRequests(MediaTypes.MOVIES, RequestTypes.INCOMING);

  const {
    requests: seriesRequestsReceived,
    updateRequest: updateReceivedSeriesRequest,
    deleteRequest: deleteIncomingSeries,
  } = useRequests(MediaTypes.SERIES, RequestTypes.INCOMING);

  const { pushSuccess, pushDanger } = useAlert();

  const acceptMovieRequest = (requestId: number) => {
    if (radarrConfig.data) {
      patch<IMovieRequest>(APIRoutes.UPDATE_REQUEST_MOVIE(requestId), {
        status: RequestStatus.APPROVED,
        providerId: radarrConfig.data.id,
      }).then((res) => {
        if (res.status === 200) {
          updateReceivedMovieRequest(requestId, RequestStatus.APPROVED);
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
          pushSuccess("Request accepted");
        } else {
          pushDanger("Cannot accept request, try again later...");
        }
      });
    }
  };

  const refuseMovieRequest = (requestId: number) => {
    patch<IMovieRequest>(APIRoutes.UPDATE_REQUEST_MOVIE(requestId), {
      status: RequestStatus.REFUSED,
      providerId: null,
    }).then((res) => {
      if (res.status === 200) {
        updateReceivedMovieRequest(requestId, RequestStatus.REFUSED);
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
        pushSuccess("Request refused");
      } else {
        pushDanger("Cannot refused request, try again later...");
      }
    });
  };

  const deleteMovieRequestReceived = (requestId: number) => {
    remove(APIRoutes.UPDATE_REQUEST_MOVIE(requestId)).then((res) => {
      if (res.status === 200) {
        deleteIncomingMovie(requestId);
        pushSuccess("Request deleted");
      } else {
        pushDanger("Error deleting request");
      }
    });
  };

  const deleteSeriesRequestReceived = (requestId: number) => {
    remove(APIRoutes.UPDATE_REQUEST_SERIES(requestId)).then((res) => {
      if (res.status === 200) {
        deleteIncomingSeries(requestId);
        pushSuccess("Request deleted");
      } else {
        pushDanger("Error deleting request");
      }
    });
  };

  return (
    <RequestsReceivedContext.Provider
      value={{
        radarrConfig,
        currentSonarrConfig: currentSonarrConfig.data,
        moviesRequestsReceived,
        seriesRequestsReceived,
        acceptMovieRequest,
        acceptSeriesRequest,
        refuseMovieRequest,
        refuseSeriesRequest,
        deleteMovieRequestReceived,
        deleteSeriesRequestReceived,
      }}
    >
      {props.children}
    </RequestsReceivedContext.Provider>
  );
};
