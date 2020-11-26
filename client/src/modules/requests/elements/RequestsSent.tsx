import React from "react";
import { Container } from "../../../utils/elements/Container";
import { useRequests } from "../hooks/useRequests";
import { RequestTypes } from "../enums/RequestTypes";
import { MovieRequestSent } from "./MovieRequestSent";
import { SeriesRequestSent } from "./SeriesRequestSent";
import { MediasTypes } from "../../media/enums/MediasTypes";
import Spinner from "../../../utils/elements/Spinner";
import { isArrayOfSeriesRequest } from "../models/IRequest";

const RequestsSent = () => {
  const moviesRequestsSent = useRequests(MediasTypes.MOVIE, RequestTypes.SENT);
  const seriesRequestsSent = useRequests(MediasTypes.SERIES, RequestTypes.SENT);

  return (
    <Container>
      <h3 className="title is-3">Movies requested</h3>
      {!moviesRequestsSent && <Spinner />}
      {moviesRequestsSent &&
        moviesRequestsSent.map((rs, index) => (
          <MovieRequestSent key={index} request={rs} />
        ))}
      <div className="is-divider" />
      <h3 className="title is-3">Series requested</h3>
      {!seriesRequestsSent && <Spinner />}
      {seriesRequestsSent &&
        isArrayOfSeriesRequest(seriesRequestsSent) &&
        seriesRequestsSent.map((rs, index) => (
          <SeriesRequestSent key={index} request={rs} />
        ))}
      <div className="is-divider" />
    </Container>
  );
};

export { RequestsSent };
