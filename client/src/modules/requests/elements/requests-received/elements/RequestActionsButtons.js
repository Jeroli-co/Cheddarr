import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useRequestService } from "../../../hooks/useRequestService";
import styled from "styled-components";
import { useRequestUtils } from "../../../hooks/useRequestUtils";
import { SCREEN_SIZE } from "../../../../../utils/enums/ScreenSizes";
import { DeleteRequestButton } from "./DeleteRequestButton";
import { RequestsReceivedContext } from "../../../contexts/RequestsReceivedContext";
import { RequestReceivedContext } from "../../../contexts/RequestReceivedContext";
import { MEDIA_TYPES } from "../../../../media/enums/MediaTypes";

const RequestActionsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid ${(props) => props.theme.dark};
  padding-top: 10px;
  padding-bottom: 10px;

  & .request-providers-container {
    display: flex;
    align-items: center;

    & .request-providers-label {
      margin-right: 10px;
    }
  }

  & .request-actions-container {
    display: flex;

    & button {
      flex-grow: 1;
    }

    & button:nth-child(1) {
      margin-right: 10px;
    }
  }

  & .request-status-text {
    color: ${(props) => props.theme.dark};
    text-align: center;
    font-size: 1em;

    & .request-status-state {
      color: ${(props) => props.requestStateColor};
    }
  }

  & .request-deleted-container {
    background-color: ${(props) => props.theme.dangerLight};
    color: ${(props) => props.theme.danger};
    border-radius: 8px;
    width: 100%;
  }
`;

const RequestActionsButtons = ({ currentRequest }) => {
  const { providers, acceptRequest, refuseRequest } = useContext(
    RequestsReceivedContext
  );
  const { request, media } = useContext(RequestReceivedContext);
  const [providerSelected, setProviderSelected] = useState(providers[0]);

  const isSeries = media.media_type === MEDIA_TYPES.SERIES;

  const onProviderChange = (e) => {
    setProviderSelected(e.target.value);
    e.preventDefault();
  };

  const onAcceptRequest = (e) => {
    const current_request_id =
      media.media_type === MEDIA_TYPES.SERIES
        ? currentRequest.childRequest.id
        : currentRequest.id;
    acceptRequest(request.id, current_request_id, providerSelected.id);
    e.preventDefault();
  };

  const onRefusedRequest = (e) => {
    const current_request_id =
      media.media_type === MEDIA_TYPES.SERIES
        ? currentRequest.childRequest.id
        : currentRequest.id;
    refuseRequest(request.id, current_request_id);
    e.preventDefault();
  };

  const {
    getRequestState,
    getRequestColor,
    isRequestPending,
  } = useRequestUtils();

  if (
    !isRequestPending(isSeries ? currentRequest.childRequest : currentRequest)
  ) {
    return (
      <RequestActionsContainer
        requestStateColor={getRequestColor(
          isSeries ? currentRequest.childRequest : currentRequest
        )}
      >
        <p className="request-status-text">
          Request{" "}
          <span className="request-status-state">
            {getRequestState(
              isSeries ? currentRequest.childRequest : currentRequest
            )}
          </span>
        </p>
        <DeleteRequestButton currentRequest={currentRequest} />
      </RequestActionsContainer>
    );
  }

  return (
    <RequestActionsContainer>
      <div className="request-providers-container">
        <p className="request-providers-label">
          <b>Providers: </b>
        </p>
        <select onChange={onProviderChange}>
          {providers.map((provider) => (
            <option key={provider.id} value={provider}>
              {provider.name}
            </option>
          ))}
        </select>
      </div>
      <div className="request-actions-container">
        <button
          type="button"
          className="button is-success is-small"
          onClick={onAcceptRequest}
        >
          <span className="icon is-small">
            <FontAwesomeIcon icon={faCheck} />
          </span>
        </button>
        <button
          type="button"
          className="button is-danger is-small"
          onClick={onRefusedRequest}
        >
          <span className="icon is-small">
            <FontAwesomeIcon icon={faTimes} />
          </span>
        </button>
      </div>
    </RequestActionsContainer>
  );
};

export { RequestActionsButtons };
