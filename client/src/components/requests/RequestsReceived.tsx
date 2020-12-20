import React, { useContext } from "react";
import { Container } from "../elements/Container";
import { MovieRequestReceived } from "./MovieRequestReceived";
import { SeriesRequestReceived } from "./SeriesRequestReceived";
import Spinner from "../elements/Spinner";
import { IMovieRequest, ISeriesRequest } from "../../models/IRequest";
import { RequestsReceivedContext } from "../../contexts/requests/requests-received/RequestsReceivedContext";

const RequestsReceived = () => {
  const { moviesRequestsReceived, seriesRequestsReceived } = useContext(
    RequestsReceivedContext
  );

  return (
    <Container>
      <h3 className="title is-3">Movies requested</h3>
      {moviesRequestsReceived.isLoading && <Spinner />}
      {!moviesRequestsReceived.isLoading &&
        moviesRequestsReceived.data &&
        moviesRequestsReceived.data.map((rs, index) => (
          <MovieRequestReceived key={index} request={rs as IMovieRequest} />
        ))}
      <div className="is-divider" />
      <h3 className="title is-3">Series requested</h3>
      {seriesRequestsReceived.isLoading && <Spinner />}
      {!seriesRequestsReceived.isLoading &&
        seriesRequestsReceived.data &&
        seriesRequestsReceived.data.map((rs, index) => (
          <SeriesRequestReceived key={index} request={rs as ISeriesRequest} />
        ))}
      <div className="is-divider" />
    </Container>
  );
};

export { RequestsReceived };
