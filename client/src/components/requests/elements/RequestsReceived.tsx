import React from "react";
import { Container } from "../../elements/Container";
import { useRequests } from "../../../hooks/useRequests";
import { RequestTypes } from "../../../enums/RequestTypes";
import { MovieRequestReceived } from "./MovieRequestReceived";
import { SeriesRequestReceived } from "./SeriesRequestReceived";
import { MediasTypes } from "../../../enums/MediasTypes";
import Spinner from "../../elements/Spinner";
import { IMovieRequest, ISeriesRequest } from "../../../models/IRequest";

const RequestsReceived = () => {
  const moviesRequestsReceived = useRequests(
    MediasTypes.MOVIE,
    RequestTypes.INCOMING
  );
  const seriesRequestsReceived = useRequests(
    MediasTypes.SERIES,
    RequestTypes.INCOMING
  );

  return (
    <Container>
      <h3 className="title is-3">Movies requested</h3>
      {!moviesRequestsReceived && <Spinner />}
      {moviesRequestsReceived &&
        moviesRequestsReceived.map((rs, index) => (
          <MovieRequestReceived key={index} request={rs as IMovieRequest} />
        ))}
      <div className="is-divider" />
      <h3 className="title is-3">Series requested</h3>
      {!seriesRequestsReceived && <Spinner />}
      {seriesRequestsReceived &&
        seriesRequestsReceived.map((rs, index) => (
          <SeriesRequestReceived key={index} request={rs as ISeriesRequest} />
        ))}
      <div className="is-divider" />
    </Container>
  );
};

export { RequestsReceived };
