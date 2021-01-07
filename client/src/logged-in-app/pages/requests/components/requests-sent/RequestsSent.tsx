import React, { useContext } from "react";
import { Container } from "../../../../../shared/components/Container";
import { MovieRequestSent } from "./MovieRequestSent";
import { SeriesRequestSent } from "./SeriesRequestSent";
import Spinner from "../../../../../shared/components/Spinner";
import { IMovieRequest, ISeriesRequest } from "../../models/IMediaRequest";
import { RequestsSentContext } from "../../contexts/RequestsSentContext";

const RequestsSent = () => {
  const { moviesRequestsSent, seriesRequestsSent } = useContext(
    RequestsSentContext
  );

  return (
    <Container>
      <h3 className="title is-3">Movies requested</h3>
      {moviesRequestsSent.isLoading && <Spinner />}
      {!moviesRequestsSent.isLoading &&
        moviesRequestsSent.data &&
        moviesRequestsSent.data.map((rs, index) => (
          <MovieRequestSent key={index} request={rs as IMovieRequest} />
        ))}
      <div className="is-divider" />
      <h3 className="title is-3">Series requested</h3>
      {seriesRequestsSent.isLoading && <Spinner />}
      {!seriesRequestsSent.isLoading &&
        seriesRequestsSent.data &&
        seriesRequestsSent.data.map((rs, index) => (
          <SeriesRequestSent key={index} request={rs as ISeriesRequest} />
        ))}
      <div className="is-divider" />
    </Container>
  );
};

export { RequestsSent };
