import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useRequestService } from "../../../hooks/useRequestService";
import styled from "styled-components";
import { useRequestUtils } from "../../../hooks/useRequestUtils";
import { SCREEN_SIZE } from "../../../../../utils/enums/ScreenSizes";

const RequestActionsContainer = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: ${SCREEN_SIZE.MOBILE_LARGE}px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  & .request-providers-container {
    display: flex;
    align-items: center;

    & .request-providers-label {
      margin-right: 10px;
    }

    @media (max-width: ${SCREEN_SIZE.MOBILE_LARGE}px) {
      padding-bottom: 10px;
    }
  }

  & .request-actions-container {
    display: flex;

    @media (max-width: ${SCREEN_SIZE.MOBILE_LARGE}px) {
      & button {
        width: 50%;
      }
    }

    @media (min-width: ${SCREEN_SIZE.MOBILE_LARGE}px) {
      & button {
        width: 100px;
      }
    }

    & button:nth-child(1) {
      margin-right: 10px;
    }
  }

  & .request-status-text {
    color: ${(props) => props.requestStateColor};
    background: white;
    border-radius: 8px;
    padding-top: 5px;
    padding-bottom: 5px;
    padding-left: 10px;
    padding-right: 10px;
    text-align: center;
  }
`;

const RequestActionsButtons = ({
  media_type,
  request,
  providers,
  updateRequest,
}) => {
  const { acceptRequest, refuseRequest } = useRequestService();
  const [providerSelected, setProviderSelected] = useState(null);

  useEffect(() => {
    if (providers && providers.length > 0) {
      setProviderSelected(providers[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [providers]);

  const onProviderChange = (e) => {
    setProviderSelected(e.target.value);
    e.preventDefault();
  };

  const onAcceptRequest = (e) => {
    acceptRequest(media_type, request.id, providerSelected.id).then((res) => {
      if (res && res.hasOwnProperty("data")) updateRequest(res.data);
    });
    e.preventDefault();
  };

  const onRefusedRequest = (e) => {
    refuseRequest(media_type, request.id).then((res) => {
      if (res && res.hasOwnProperty("data")) updateRequest(res.data);
    });
    e.preventDefault();
  };

  const {
    getRequestState,
    getRequestColor,
    isRequestPending,
  } = useRequestUtils();

  if (!isRequestPending(request)) {
    let requestStateText = getRequestState(request);
    requestStateText =
      requestStateText[0].toUpperCase() +
      requestStateText.substring(1).toLowerCase();
    const requestStateTextColor = getRequestColor(request);
    return (
      <RequestActionsContainer requestStateColor={requestStateTextColor}>
        <p className="request-status-text">{requestStateText}</p>
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
