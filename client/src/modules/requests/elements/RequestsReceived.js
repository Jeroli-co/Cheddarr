import React from "react";
import RequestsSpinner from "./RequestsSpinner";
import { Container } from "../../../utils/elements/Container";
import { useRequests } from "../hooks/useRequests";
import { MEDIA_TYPES } from "../../media/enums/MediaTypes";
import { REQUESTS_TYPE } from "../enums/RequestTypes";
import { MovieRequestReceived } from "./MovieRequestReceived";
import { SeriesRequestReceived } from "./SeriesRequestReceived";

const RequestsReceived = () => {
  const moviesRequestsReceived = useRequests(
    MEDIA_TYPES.MOVIES,
    REQUESTS_TYPE.RECEIVED
  );
  const seriesRequestsReceived = useRequests(
    MEDIA_TYPES.SERIES,
    REQUESTS_TYPE.RECEIVED
  );

  return (
    <Container>
      <h3 className="title is-3">Movies requested</h3>
      {!moviesRequestsReceived && <RequestsSpinner />}
      {moviesRequestsReceived &&
        moviesRequestsReceived.map((rs, index) => (
          <MovieRequestReceived key={index} request={rs} />
        ))}
      <div className="is-divider" />
      <h3 className="title is-3">Series requested</h3>
      {!seriesRequestsReceived && <RequestsSpinner />}
      {seriesRequestsReceived &&
        seriesRequestsReceived.map((rs, index) => (
          <SeriesRequestReceived key={index} request={rs} />
        ))}
      <div className="is-divider" />
    </Container>
  );
};

export { RequestsReceived };
