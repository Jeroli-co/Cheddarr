import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router";
import { usePlex } from "../hooks/usePlex";
import { Spinner } from "../elements/Spinner";
import { RowLayout } from "../elements/layouts";
import { MediaExtendedCardHead } from "../widgets/media-recently-added/elements/MediaExtendedCardHead";

const MediaExtendedCardStyle = styled.div`
  margin: 0;
  padding: 1%;
`;

const MediaDetailsPoster = styled.img`
  min-width: 40%;
  max-width: 40%;
  height: auto;
  border-radius: 12px;
`;

const MediaDetailsInfo = styled.div`
  padding-left: 1%;
  padding-right: 1%;
`;

const EpisodePage = () => {
  const { seriesId, seasonNumber, episodeNumber } = useParams();
  const [episode, setEpisode] = useState(null);
  const { getEpisode } = usePlex();

  useEffect(() => {
    getEpisode(seriesId, seasonNumber, episodeNumber).then((e) => {
      if (e) setEpisode(e);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!episode)
    return (
      <Spinner
        justifyContent="center"
        color="primary"
        size="2x"
        padding="1em"
      />
    );

  return (
    <MediaExtendedCardStyle>
      <RowLayout alignItems="flex-start">
        <MediaDetailsPoster src={episode.thumbUrl} alt={episode.title} />
        <MediaDetailsInfo>
          <MediaExtendedCardHead media={episode} />

          <RowLayout childMarginTop="1em">
            <div>
              <div className="is-size-5">Overview</div>
              <div className="is-size-6">{episode.summary}</div>
            </div>
          </RowLayout>
        </MediaDetailsInfo>
      </RowLayout>
    </MediaExtendedCardStyle>
  );
};

export { EpisodePage };
