import React from "react";
import { Container } from "../../elements/Container";
import { useRequests } from "../../../hooks/useRequests";
import { RequestTypes } from "../../../enums/RequestTypes";
import { MovieRequestSent } from "./MovieRequestSent";
import { SeriesRequestSent } from "./SeriesRequestSent";
import { MediasTypes } from "../../../enums/MediasTypes";
import Spinner from "../../elements/Spinner";
import { IMovieRequest, ISeriesRequest } from "../../../models/IRequest";

const RequestsSent = () => {
  const moviesRequestsSent = useRequests(
    MediasTypes.MOVIE,
    RequestTypes.OUTGOING
  );
  const seriesRequestsSent = useRequests(
    MediasTypes.SERIES,
    RequestTypes.OUTGOING
  );

  return (
    <Container>
      <h3 className="title is-3">Movies requested</h3>
      {!moviesRequestsSent && <Spinner />}
      {moviesRequestsSent &&
        moviesRequestsSent.map((rs, index) => (
          <MovieRequestSent key={index} request={rs as IMovieRequest} />
        ))}
      <div className="is-divider" />
      <h3 className="title is-3">Series requested</h3>
      {!seriesRequestsSent && <Spinner />}
      {seriesRequestsSent &&
        seriesRequestsSent.map((rs, index) => (
          <SeriesRequestSent key={index} request={rs as ISeriesRequest} />
        ))}
      <div className="is-divider" />
    </Container>
  );
};

export { RequestsSent };
