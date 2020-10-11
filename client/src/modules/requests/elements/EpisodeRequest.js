import React from "react";
import { useMedia } from "../../media/hooks/useMedia";
import { MEDIA_TYPES } from "../../media/enums/MediaTypes";
import { Spinner } from "../../../utils/elements/Spinner";

import styled from "styled-components";

const EpisodeRequestContainer = styled.p`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const EpisodeRequest = ({ series_id, season_number, episode_number }) => {
  const episode = useMedia(
    MEDIA_TYPES.SERIES,
    series_id,
    season_number,
    episode_number
  );

  if (!episode.isLoaded) {
    return <Spinner />;
  }

  return (
    <EpisodeRequestContainer>
      Episode {episode.data.episode_number}: {episode.data.name}
    </EpisodeRequestContainer>
  );
};

export { EpisodeRequest };
