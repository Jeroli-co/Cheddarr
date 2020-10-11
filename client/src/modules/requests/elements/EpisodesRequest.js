import React from "react";
import { EpisodeRequest } from "./EpisodeRequest";
import styled, { css } from "styled-components";
import { SCREEN_SIZE } from "../../../utils/enums/ScreenSizes";

const EpisodesRequestContainer = styled.div`
  flex-grow: 1;
  max-width: 50%;
  padding-left: 10px;

  ${(props) =>
    props.isAllSeasonRequested &&
    css`
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
    `}

  @media (min-width: ${SCREEN_SIZE.MOBILE_LARGE}px) {
    max-width: 70%;
  }

  & .episodes-list-container {
    margin-left: 5px;
    padding-left: 5px;
    border-left: 1px solid ${(props) => props.theme.dark};
  }
`;

const EpisodesRequest = ({ series_id, season }) => {
  const isAllSeasonRequested = season.episodes.length === 0;
  return (
    <EpisodesRequestContainer isAllSeasonRequested={isAllSeasonRequested}>
      {isAllSeasonRequested && (
        <p>
          <b>All season requested</b>
        </p>
      )}
      {!isAllSeasonRequested && (
        <p>
          <b>
            {season.episodes.length} Episodes in season {season.season_number}
          </b>
        </p>
      )}
      <div className="episodes-list-container">
        {season.episodes.map((episode, index) => (
          <EpisodeRequest
            key={index}
            series_id={series_id}
            season_number={season.season_number}
            episode_number={episode.episode_number}
          />
        ))}
      </div>
    </EpisodesRequestContainer>
  );
};

export { EpisodesRequest };
