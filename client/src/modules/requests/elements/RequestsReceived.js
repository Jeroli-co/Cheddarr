import React, { useEffect } from "react";
import RequestsSpinner from "./RequestsSpinner";
import { Container } from "../../../elements/Container";
import { useRequests } from "../hooks/useRequests";
import { MEDIA_TYPES } from "../../media/enums/MediaTypes";
import { REQUESTS_TYPE } from "../enums/RequestTypes";
import { MovieRequestReceived } from "./MovieRequestReceived";
import { SeriesRequestReceived } from "./SeriesRequestReceived";

const RequestsReceived = () => {
  const moviesRequestsPending = useRequests(
    MEDIA_TYPES.MOVIES,
    REQUESTS_TYPE.RECEIVED
  );
  const seriesRequestsPending = useRequests(
    MEDIA_TYPES.SERIES,
    REQUESTS_TYPE.RECEIVED
  );

  useEffect(() => {
    console.log(moviesRequestsPending);
  }, [moviesRequestsPending]);

  return (
    <Container>
      <h3 className="title is-3">Movies requested</h3>
      {!moviesRequestsPending && <RequestsSpinner />}
      {moviesRequestsPending &&
        moviesRequestsPending.map((rs, index) => (
          <MovieRequestReceived key={index} request={rs} />
        ))}
      <div className="is-divider" />
      <h3 className="title is-3">Series requested</h3>
      {!seriesRequestsPending && <RequestsSpinner />}
      {seriesRequestsPending &&
        seriesRequestsPending.map((rs, index) => (
          <SeriesRequestReceived key={index} request={rs} />
        ))}
      <div className="is-divider" />
    </Container>
  );
};

export { RequestsReceived };
