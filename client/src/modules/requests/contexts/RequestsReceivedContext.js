import React, { createContext, useEffect } from "react";
import { useRequests } from "../hooks/useRequests";
import { REQUESTS_TYPE } from "../enums/RequestTypes";
import { useProviders } from "../../providers/hooks/useProviders";
import { Spinner } from "../../../utils/elements/Spinner";
import { MediaRequestReceived } from "../elements/requests-received/elements/MediaRequestReceived";
import styled from "styled-components";
import { RequestReceivedContextProvider } from "./RequestReceivedContext";

const MediaRequestsReceivedContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const RequestsReceivedContext = createContext();

const RequestsReceivedContextProvider = ({ media_type }) => {
  const providers = useProviders(media_type);
  const {
    requests: requestsReceived,
    acceptRequest,
    refuseRequest,
    deleteRequest,
  } = useRequests(media_type, REQUESTS_TYPE.RECEIVED);

  if (!providers || !requestsReceived) {
    return <Spinner size="2x" />;
  }

  return (
    <RequestsReceivedContext.Provider
      value={{ providers, acceptRequest, refuseRequest, deleteRequest }}
    >
      <MediaRequestsReceivedContainer>
        {requestsReceived.map((request) => (
          <RequestReceivedContextProvider
            key={request.id}
            request={{ ...request }}
            media_type={media_type}
          >
            <MediaRequestReceived />
          </RequestReceivedContextProvider>
        ))}
      </MediaRequestsReceivedContainer>
    </RequestsReceivedContext.Provider>
  );
};

export { RequestsReceivedContext, RequestsReceivedContextProvider };
