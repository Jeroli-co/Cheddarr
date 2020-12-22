import React, { useContext } from "react";
import { useRequests } from "../../../hooks/useRequests";
import { MediasTypes } from "../../../enums/MediasTypes";
import { RequestTypes } from "../../../enums/RequestTypes";
import { NotificationContext } from "../../notifications/NotificationContext";
import { RequestService } from "../../../services/RequestService";
import { RequestsSentContext } from "./RequestsSentContext";

export const RequestsSentContextProvider = (props: any) => {
  const {
    requests: moviesRequestsSent,
    deleteRequest: deleteOutgoingMovie,
  } = useRequests(MediasTypes.MOVIES, RequestTypes.OUTGOING);

  const {
    requests: seriesRequestsSent,
    deleteRequest: deleteOutgoingSeries,
  } = useRequests(MediasTypes.SERIES, RequestTypes.OUTGOING);

  const { pushSuccess, pushDanger } = useContext(NotificationContext);

  const deleteMovieRequestSent = (requestId: number) => {
    RequestService.DeleteRequest(MediasTypes.MOVIES, requestId).then((res) => {
      if (res.error === null) {
        deleteOutgoingMovie(requestId);
        pushSuccess("Request deleted");
      } else {
        pushDanger("Error deleting request");
      }
    });
  };

  const deleteSeriesRequestSent = (requestId: number) => {
    RequestService.DeleteRequest(MediasTypes.SERIES, requestId).then((res) => {
      if (res.error === null) {
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
