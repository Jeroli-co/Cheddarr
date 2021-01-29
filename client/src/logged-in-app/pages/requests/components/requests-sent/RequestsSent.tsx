import React, { useContext } from "react";
import { Container } from "../../../../../shared/components/Container";
import { MovieRequestSent } from "./MovieRequestSent";
import { SeriesRequestSent } from "./SeriesRequestSent";
import Spinner from "../../../../../shared/components/Spinner";
import { IMovieRequest, ISeriesRequest } from "../../models/IMediaRequest";
import { RequestsSentContext } from "../../contexts/RequestsSentContext";
import { PrimaryDivider } from "../../../../../experimentals/Divider";

const RequestsSent = () => {
  const { moviesRequestsSent, seriesRequestsSent } = useContext(
    RequestsSentContext
  );

  return (
    <Container>
      <h3 className="is-size-3">Movies requested</h3>
      {moviesRequestsSent.isLoading && <Spinner />}
      {!moviesRequestsSent.isLoading &&
        moviesRequestsSent.data &&
        moviesRequestsSent.data.map((rs, index) => (
          <MovieRequestSent key={index} request={rs as IMovieRequest} />
        ))}
      <PrimaryDivider />
      <h3 className="is-size-3">Series requested</h3>
      {seriesRequestsSent.isLoading && <Spinner />}
      {!seriesRequestsSent.isLoading &&
        seriesRequestsSent.data &&
        seriesRequestsSent.data.map((rs, index) => (
          <SeriesRequestSent key={index} request={rs as ISeriesRequest} />
        ))}
    </Container>
  );
};

export { RequestsSent };
