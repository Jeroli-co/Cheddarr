import React from "react";
import { Container } from "../../../utils/elements/Container";
import { useRequests } from "../hooks/useRequests";
import { RequestTypes } from "../enums/RequestTypes";
import { MovieRequestReceived } from "./MovieRequestReceived";
import { SeriesRequestReceived } from "./SeriesRequestReceived";
import { MediasTypes } from "../../media/enums/MediasTypes";
import Spinner from "../../../utils/elements/Spinner";
import { isArrayOfSeriesRequest } from "../models/IRequest";

const RequestsReceived = () => {
  const moviesRequestsReceived = useRequests(
    MediasTypes.MOVIE,
    RequestTypes.RECEIVED
  );
  const seriesRequestsReceived = useRequests(
    MediasTypes.SERIES,
    RequestTypes.RECEIVED
  );

  return (
    <Container>
      <h3 className="title is-3">Movies requested</h3>
      {!moviesRequestsReceived && <Spinner />}
      {moviesRequestsReceived &&
        moviesRequestsReceived.map((rs, index) => (
          <MovieRequestReceived key={index} request={rs} />
        ))}
      <div className="is-divider" />
      <h3 className="title is-3">Series requested</h3>
      {!seriesRequestsReceived && <Spinner />}
      {seriesRequestsReceived &&
        isArrayOfSeriesRequest(seriesRequestsReceived) &&
        seriesRequestsReceived.map((rs, index) => (
          <SeriesRequestReceived key={index} request={rs} />
        ))}
      <div className="is-divider" />
    </Container>
  );
};

export { RequestsReceived };
