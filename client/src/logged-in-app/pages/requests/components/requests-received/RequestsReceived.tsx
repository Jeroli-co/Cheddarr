import React, { useContext } from "react";
import { Container } from "../../../../../shared/components/Container";
import { MovieRequestReceived } from "./MovieRequestReceived";
import { SeriesRequestReceived } from "./SeriesRequestReceived";
import Spinner from "../../../../../shared/components/Spinner";
import { IMovieRequest, ISeriesRequest } from "../../models/IMediaRequest";
import { RequestsReceivedContext } from "../../contexts/RequestsReceivedContext";
import { PrimaryDivider } from "../../../../../experimentals/Divider";

const RequestsReceived = () => {
  const { moviesRequestsReceived, seriesRequestsReceived } = useContext(
    RequestsReceivedContext
  );

  return (
    <Container>
      <h3 className="is-size-3">Movies requested</h3>
      {moviesRequestsReceived.isLoading && <Spinner />}
      {!moviesRequestsReceived.isLoading &&
        moviesRequestsReceived.data &&
        moviesRequestsReceived.data.map((rs, index) => (
          <MovieRequestReceived key={index} request={rs as IMovieRequest} />
        ))}
      <PrimaryDivider />
      <h3 className="is-size-3">Series requested</h3>
      {seriesRequestsReceived.isLoading && <Spinner />}
      {!seriesRequestsReceived.isLoading &&
        seriesRequestsReceived.data &&
        seriesRequestsReceived.data.map((rs, index) => (
          <SeriesRequestReceived key={index} request={rs as ISeriesRequest} />
        ))}
    </Container>
  );
};

export { RequestsReceived };
