import React from "react";
import { EpisodeRequest } from "./EpisodeRequest";
import styled, { css } from "styled-components";
import { SCREEN_SIZE } from "../../../utils/enums/ScreenSizes";

const EpisodesRequestContainer = styled.div`
  flex-grow: 1;
  max-width: 50%;

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
      {season.episodes.map((episode, index) => (
        <EpisodeRequest
          key={index}
          series_id={series_id}
          season_number={season.season_number}
          episode_number={episode.episode_number}
        />
      ))}
    </EpisodesRequestContainer>
  );
};

export { EpisodesRequest };
