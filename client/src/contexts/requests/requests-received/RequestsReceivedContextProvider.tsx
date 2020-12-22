import { useRequests } from "../../../hooks/useRequests";
import { MediasTypes } from "../../../enums/MediasTypes";
import { RequestTypes } from "../../../enums/RequestTypes";
import { RequestService } from "../../../services/RequestService";
import { RequestStatus } from "../../../enums/RequestStatus";
import React, { useContext } from "react";
import { NotificationContext } from "../../notifications/NotificationContext";
import { useRadarrConfig } from "../../../hooks/useRadarrConfig";
import { useSonarrConfig } from "../../../hooks/useSonarrConfig";
import { RequestsReceivedContext } from "./RequestsReceivedContext";

export const RequestsReceivedContextProvider = (props: any) => {
  const radarrConfig = useRadarrConfig();

  const sonarrConfig = useSonarrConfig();

  const {
    requests: moviesRequestsReceived,
    updateRequest: updateReceivedMovieRequest,
    deleteRequest: deleteIncomingMovie,
  } = useRequests(MediasTypes.MOVIES, RequestTypes.INCOMING);

  const {
    requests: seriesRequestsReceived,
    updateRequest: updateReceivedSeriesRequest,
    deleteRequest: deleteIncomingSeries,
  } = useRequests(MediasTypes.SERIES, RequestTypes.INCOMING);

  const { pushSuccess, pushDanger } = useContext(NotificationContext);

  const acceptMovieRequest = (requestId: number) => {
    if (radarrConfig.data) {
      RequestService.UpdateMediasRequest(MediasTypes.MOVIES, requestId, {
        status: RequestStatus.APPROVED,
        providerId: radarrConfig.data.id,
      }).then((res) => {
        if (res.error === null) {
          updateReceivedMovieRequest(requestId, RequestStatus.APPROVED);
          pushSuccess("Request accepted");
        } else {
          pushDanger("Cannot accept request, try again later...");
        }
      });
    }
  };

  const acceptSeriesRequest = (requestId: number) => {
    if (sonarrConfig.data) {
      RequestService.UpdateMediasRequest(MediasTypes.SERIES, requestId, {
        status: RequestStatus.APPROVED,
        providerId: sonarrConfig.data.id,
      }).then((res) => {
        if (res.error === null) {
          updateReceivedSeriesRequest(requestId, RequestStatus.APPROVED);
          pushSuccess("Request accepted");
        } else {
          pushDanger("Cannot accept request, try again later...");
        }
      });
    }
  };

  const refuseMovieRequest = (requestId: number) => {
    RequestService.UpdateMediasRequest(MediasTypes.MOVIES, requestId, {
      status: RequestStatus.REFUSED,
      providerId: null,
    }).then((res) => {
      if (res.error === null) {
        updateReceivedMovieRequest(requestId, RequestStatus.REFUSED);
        pushSuccess("Request refused");
      } else {
        pushDanger("Cannot refused request, try again later...");
      }
    });
  };

  const refuseSeriesRequest = (requestId: number) => {
    RequestService.UpdateMediasRequest(MediasTypes.SERIES, requestId, {
      status: RequestStatus.REFUSED,
      providerId: null,
    }).then((res) => {
      if (res.error === null) {
        updateReceivedSeriesRequest(requestId, RequestStatus.REFUSED);
        pushSuccess("Request refused");
      } else {
        pushDanger("Cannot refused request, try again later...");
      }
    });
  };

  const deleteMovieRequestReceived = (requestId: number) => {
    RequestService.DeleteRequest(MediasTypes.MOVIES, requestId).then((res) => {
      if (res.error === null) {
        deleteIncomingMovie(requestId);
        pushSuccess("Request deleted");
      } else {
        pushDanger("Error deleting request");
      }
    });
  };

  const deleteSeriesRequestReceived = (requestId: number) => {
    RequestService.DeleteRequest(MediasTypes.SERIES, requestId).then((res) => {
      if (res.error === null) {
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
        sonarrConfig,
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
