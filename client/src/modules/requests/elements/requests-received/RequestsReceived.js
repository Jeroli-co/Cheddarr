import React from "react";
import { useRequests } from "../../hooks/useRequests";
import { MEDIA_TYPES } from "../../../media/enums/MediaTypes";
import { REQUESTS_TYPE } from "../../enums/RequestTypes";
import { useProviders } from "../../../providers/hooks/useProviders";
import { useProvidersUtils } from "../../../providers/hooks/useProvidersUtils";
import { Spinner } from "../../../../utils/elements/Spinner";
import styled from "styled-components";
import { MediaRequestReceived } from "./elements/MediaRequestReceived";

const MediaRequestsReceivedContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const RequestsReceived = () => {
  const moviesRequestsReceived = useRequests(
    MEDIA_TYPES.MOVIES,
    REQUESTS_TYPE.RECEIVED
  );

  const seriesRequestsReceived = useRequests(
    MEDIA_TYPES.SERIES,
    REQUESTS_TYPE.RECEIVED
  );

  const providers = useProviders();
  const { getProvidersByMediasType } = useProvidersUtils();

  return (
    <div>
      <h3 className="title is-3">Movies requests received</h3>
      {(!moviesRequestsReceived || !providers) && <Spinner size="2x" />}
      <MediaRequestsReceivedContainer>
        {moviesRequestsReceived &&
          providers &&
          moviesRequestsReceived.map((rs, index) => (
            <MediaRequestReceived
              key={index}
              request={rs}
              media_type={MEDIA_TYPES.MOVIES}
              providers={getProvidersByMediasType(
                providers,
                MEDIA_TYPES.MOVIES
              )}
            />
          ))}
      </MediaRequestsReceivedContainer>
      <div className="is-divider" />
      <h3 className="title is-3">Series requests received</h3>
      {(!seriesRequestsReceived || !providers) && <Spinner size="2x" />}
      <MediaRequestsReceivedContainer>
        {seriesRequestsReceived &&
          providers &&
          seriesRequestsReceived.map((rs, index) => (
            <MediaRequestReceived
              key={index}
              request={rs}
              media_type={MEDIA_TYPES.SERIES}
              providers={getProvidersByMediasType(
                providers,
                MEDIA_TYPES.SERIES
              )}
            />
          ))}
      </MediaRequestsReceivedContainer>
    </div>
  );
};

export { RequestsReceived };
