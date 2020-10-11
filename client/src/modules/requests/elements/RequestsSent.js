import React from "react";
import { Container } from "../../../utils/elements/Container";
import { useRequests } from "../hooks/useRequests";
import { MEDIA_TYPES } from "../../media/enums/MediaTypes";
import { REQUESTS_TYPE } from "../enums/RequestTypes";
import { MovieRequestSent } from "./MovieRequestSent";
import { SeriesRequestSent } from "./SeriesRequestSent";
import { Spinner } from "../../../utils/elements/Spinner";

const RequestsSent = () => {
  const moviesRequestsSent = useRequests(
    MEDIA_TYPES.MOVIES,
    REQUESTS_TYPE.SENT
  );
  const seriesRequestsSent = useRequests(
    MEDIA_TYPES.SERIES,
    REQUESTS_TYPE.SENT
  );

  return (
    <Container>
      <h3 className="title is-3">Movies requested</h3>
      {!moviesRequestsSent && <Spinner size="2x" />}
      {moviesRequestsSent &&
        moviesRequestsSent.map((rs, index) => (
          <MovieRequestSent key={index} request={rs} />
        ))}
      <div className="is-divider" />
      <h3 className="title is-3">Series requested</h3>
      {!seriesRequestsSent && <Spinner size="2x" />}
      {seriesRequestsSent &&
        seriesRequestsSent.map((rs, index) => (
          <SeriesRequestSent key={index} request={rs} />
        ))}
      <div className="is-divider" />
    </Container>
  );
};

export { RequestsSent };
