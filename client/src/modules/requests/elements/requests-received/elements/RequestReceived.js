import React, { useEffect, useState } from "react";
import { Image } from "../../../../../utils/elements/Image";
import { SeasonsMenu } from "../../SeasonsMenu";
import styled, { css } from "styled-components";
import { EpisodesRequest } from "../../EpisodesRequest";
import { RequestActionsButtons } from "./RequestActionsButtons";
import { MEDIA_TYPES } from "../../../../media/enums/MediaTypes";
import { Spinner } from "../../../../../utils/elements/Spinner";

const RequestContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  & .request-infos-container {
    & .requesting-user-avatar-container {
      display: flex;
      align-items: center;
      font-size: 1em;
      border-bottom: 1px solid ${(props) => props.theme.dark};
      padding-bottom: 10px;
      margin-bottom: 10px;

      & :last-child {
        margin-left: 10px;
      }
    }

    & .request-details {
      border-bottom: 1px solid ${(props) => props.theme.dark};
      padding-bottom: 10px;
      margin-bottom: 10px;
    }
  }

  & .request-series-container {
    display: flex;
    border-bottom: 1px solid ${(props) => props.theme.dark};
    margin-bottom: 10px;

    ${(props) =>
      props.isAllSeriesRequested &&
      css`
        align-items: center;
        padding-top: 15px;
        padding-bottom: 15px;
      `}
  }
`;

const RequestReceived = ({ request, media_type, media_id, providers }) => {
  const [seasonSelected, setSeasonSelected] = useState(null);
  const [currentRequest, setCurrentRequest] = useState(null);
  const isSeries = media_type === MEDIA_TYPES.SERIES;

  useEffect(() => {
    if (request) {
      setCurrentRequest(request);
    }
  }, [request]);

  useEffect(() => {
    if (isSeries) {
      if (
        currentRequest &&
        currentRequest.seasons &&
        currentRequest.seasons.length > 0
      ) {
        setSeasonSelected(currentRequest.seasons[0]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRequest]);

  const isAllSeriesRequested =
    isSeries &&
    currentRequest &&
    currentRequest.seasons.every((season) => season.episodes.length === 0);

  const handleSeasonChanges = (season) => {
    setSeasonSelected(season);
  };

  if (currentRequest === null) {
    return <Spinner />;
  }

  return (
    <RequestContainer isAllSeriesRequested={isAllSeriesRequested}>
      <div className="request-infos-container">
        <div className="requesting-user-avatar-container">
          <Image
            src={currentRequest.requesting_user.avatar}
            alt="User"
            borderRadius="50%"
            width="55px"
          />
          <p>
            <b>{currentRequest.requesting_user.username}</b>
          </p>
        </div>
        <div className="request-details">
          <p>
            <b>Requested at: </b>
            {currentRequest.requested_date}
          </p>
          <br />
          <p>
            <b>Available: </b>
            {currentRequest.available ? "Yes" : "No"}
          </p>
        </div>
      </div>
      {isSeries && seasonSelected && !isAllSeriesRequested && (
        <div className="request-series-container">
          <SeasonsMenu
            seasons={currentRequest.seasons}
            seasonSelected={seasonSelected}
            handleSeasonChanges={handleSeasonChanges}
          />
          <EpisodesRequest series_id={media_id} season={seasonSelected} />
        </div>
      )}
      {isSeries && isAllSeriesRequested && (
        <div className="request-series-container">
          <p>
            <b>All series requested</b>
          </p>
        </div>
      )}
      <RequestActionsButtons
        media_type={media_type}
        request={currentRequest}
        providers={providers}
        updateRequest={(r) => setCurrentRequest(r)}
      />
    </RequestContainer>
  );
};

export { RequestReceived };
