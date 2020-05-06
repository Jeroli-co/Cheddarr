import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router";
import { usePlex } from "../hooks/usePlex";
import { Spinner } from "../elements/Spinner";
import { RowLayout } from "../elements/layouts";
import { MediaExtendedCardHead } from "../widgets/media-recently-added/elements/MediaExtendedCardHead";
import { Link } from "react-router-dom";
import { routes } from "../router/routes";

const MediaExtendedCardStyle = styled.div`
  margin: 0;
  padding: 1%;
`;

const MediaDetailsPoster = styled.img`
  width: 20%;
  height: auto;
  border-radius: 12px;
`;

const MediaDetailsInfo = styled.div`
  padding-left: 1%;
  padding-right: 1%;
`;

const SeasonPage = () => {
  const { seriesId, seasonNumber } = useParams();
  const [season, setSeason] = useState(null);
  const { getSeason } = usePlex();

  useEffect(() => {
    getSeason(seriesId, seasonNumber).then((s) => {
      if (s) setSeason(s);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!season)
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
        <MediaDetailsPoster src={season.thumbUrl} alt={season.title} />
        <MediaDetailsInfo>
          <MediaExtendedCardHead media={season} />

          {season.summary.length > 0 && (
            <RowLayout childMarginTop="1em">
              <div>
                <div className="is-size-5">Overview</div>
                <div className="is-size-6">{season.summary}</div>
              </div>
            </RowLayout>
          )}
        </MediaDetailsInfo>
      </RowLayout>
      <hr />
      <div className="is-size-5">Episodes</div>
      <div>
        {season.episodes.map((episode) => (
          <div>
            <Link
              key={episode.id}
              to={routes.EPISODE.url(
                season.seriesId,
                season.seasonNumber,
                episode.episodeNumber
              )}
            >
              {"Episode " + episode.episodeNumber}
            </Link>
          </div>
        ))}
      </div>
    </MediaExtendedCardStyle>
  );
};

export { SeasonPage };
