import React, { useContext, useEffect, useState } from "react";
import { Image } from "../../../../../utils/elements/Image";
import { SeasonsMenu } from "../../SeasonsMenu";
import styled, { css } from "styled-components";
import { EpisodesRequest } from "../../EpisodesRequest";
import { RequestActionsButtons } from "./RequestActionsButtons";
import { Spinner } from "../../../../../utils/elements/Spinner";
import { RequestReceivedContext } from "../../../contexts/RequestReceivedContext";
import { MEDIA_TYPES } from "../../../../media/enums/MediaTypes";
import { RequestsPagination } from "./RequestsPagination";

const RequestContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;

  & .request-infos-container {
    & .requesting-user-avatar-container {
      display: flex;
      align-items: center;
      font-size: 1em;
      border-bottom: 1px solid ${(props) => props.theme.dark};
      padding-top: 10px;
      padding-bottom: 10px;

      & :last-child {
        margin-left: 10px;
      }
    }

    & .request-details {
      border-bottom: 1px solid ${(props) => props.theme.dark};
      padding-top: 10px;
      padding-bottom: 10px;
    }
  }

  & .request-series-container {
    display: flex;
    flex-grow: 1;
    padding-top: 10px;
    padding-bottom: 10px;
    ${(props) =>
      props.isAllSeriesRequested &&
      css`
        align-items: center;
      `}
  }
`;

const RequestReceived = () => {
  const { request, media } = useContext(RequestReceivedContext);

  const [currentRequest, setCurrentRequest] = useState(null);
  const [seasonSelected, setSeasonSelected] = useState(null);
  const [isAllSeriesRequested, setIsAllSeriesRequested] = useState(false);

  useEffect(() => {
    if (media.media_type === MEDIA_TYPES.SERIES) {
      if (currentRequest === null) {
        setCurrentRequest({ index: 0, childRequest: request.children[0] });
      } else {
        const indexChild = request.children.findIndex(
          (childRequest) => childRequest.id === currentRequest.childRequest.id
        );
        if (indexChild !== -1) {
          setCurrentRequest({
            index: currentRequest.index,
            childRequest: request.children[currentRequest.index],
          });
        } else {
          setCurrentRequest({
            index: 0,
            childRequest: request.children[0],
          });
        }
      }
    } else {
      setCurrentRequest(request);
    }
  }, [request]);

  useEffect(() => {
    setIsAllSeriesRequested(
      media.media_type === MEDIA_TYPES.SERIES &&
        currentRequest !== null &&
        currentRequest.childRequest.seasons.every(
          (season) => season.episodes.length === 0
        ) &&
        currentRequest.childRequest.seasons.length === media.seasons.length
    );
  }, [currentRequest]);

  const onPrevRequest = () => {
    const prevIndex =
      currentRequest.index === 0
        ? request.children.length - 1
        : currentRequest.index - 1;
    const prev = request.children[prevIndex];
    setCurrentRequest({ index: prevIndex, childRequest: prev });
  };

  const onNextRequest = () => {
    const nextIndex =
      currentRequest.index === request.children.length - 1
        ? 0
        : currentRequest.index + 1;
    const next = request.children[nextIndex];
    setCurrentRequest({ index: nextIndex, childRequest: next });
  };

  useEffect(() => {
    if (media.media_type === MEDIA_TYPES.SERIES && currentRequest !== null) {
      setSeasonSelected(currentRequest.childRequest.seasons[0]);
    }
  }, [currentRequest]);

  const handleSeasonChanges = (season) => {
    setSeasonSelected(season);
  };

  if (currentRequest === null) {
    return <Spinner size="2x" />;
  }

  const isSeries = media.media_type === MEDIA_TYPES.SERIES;

  return (
    <RequestContainer isAllSeriesRequested={isAllSeriesRequested}>
      <div className="request-infos-container">
        <div className="requesting-user-avatar-container">
          <Image
            src={
              isSeries
                ? currentRequest.childRequest.requesting_user.avatar
                : currentRequest.requesting_user.avatar
            }
            alt="User"
            borderRadius="50%"
            width="55px"
          />
          <p>
            <b>
              {isSeries
                ? currentRequest.childRequest.requesting_user.username
                : currentRequest.requesting_user.username}
            </b>
          </p>
        </div>
        <div className="request-details">
          <p>
            <b>Requested at: </b>
            {isSeries
              ? currentRequest.childRequest.requested_date
              : currentRequest.requested_date}
          </p>
          <br />
          <p>
            <b>Available: </b>
            {isSeries
              ? currentRequest.childRequest.available
                ? "Yes"
                : "No"
              : currentRequest.available
              ? "Yes"
              : "No"}
          </p>
        </div>
      </div>
      {seasonSelected !== null && !isAllSeriesRequested && (
        <div className="request-series-container">
          <SeasonsMenu
            seasons={currentRequest.childRequest.seasons}
            seasonSelected={seasonSelected}
            handleSeasonChanges={handleSeasonChanges}
          />
          <EpisodesRequest series_id={media.tvdb_id} season={seasonSelected} />
        </div>
      )}
      {isAllSeriesRequested && (
        <div className="request-series-container">
          <p>
            <b>All series requested</b>
          </p>
        </div>
      )}
      <RequestActionsButtons currentRequest={currentRequest} />
      {isSeries && request.children.length > 1 && (
        <RequestsPagination
          onPrevRequest={onPrevRequest}
          onNextRequest={onNextRequest}
          currentRequest={currentRequest}
        />
      )}
    </RequestContainer>
  );
};

export { RequestReceived };
