import React, { useEffect, useState } from "react";
import { usePlex } from "../hooks/usePlex";
import { Carousel } from "../elements/Carousel";
import { Spinner } from "../elements/Spinner";
import styled from "styled-components";
import { MediaPreviewCardStyle } from "../elements/medias/MediaPreviewCard";
import { Modal } from "../elements/Modal";
import { SeriesDetailsCard } from "../elements/medias/SeriesDetailsCard";

const Series = ({ series }) => {
  const [isSeriesCardModalActive, setIsSeriesCardModalActive] = useState(false);

  return (
    <div className="Series">
      <MediaPreviewCardStyle onClick={() => setIsSeriesCardModalActive(true)}>
        <img
          className="media-image"
          src={series.seasonThumbUrl}
          alt={series.title}
        />
        <div className="media-title">
          <div>
            <p>{series.seriesTitle}</p>
            <p>
              S{series.seasonNumber} ・ E{series.episodeNumber}
            </p>
          </div>
        </div>
      </MediaPreviewCardStyle>

      {isSeriesCardModalActive && (
        <Modal onClose={() => setIsSeriesCardModalActive(false)}>
          <SeriesDetailsCard series={series} />
        </Modal>
      )}
    </div>
  );
};

const SeriesRecentlyAddedStyled = styled.section`
  margin: 1em;
`;

const SeriesRecentlyAdded = () => {
  const { getSeriesRecentlyAdded } = usePlex();
  const [series, setSeries] = useState(null);

  useEffect(() => {
    getSeriesRecentlyAdded().then((data) => {
      if (data) setSeries(data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SeriesRecentlyAddedStyled data-testid="SeriesRecentlyAdded">
      <div className="level">
        <div className="level-left">
          <div className="level-item content">
            <p className="is-size-4 has-text-primary has-text-weight-semibold">
              Series recently added
            </p>
          </div>
        </div>
      </div>

      <div className="is-divider is-primary" />

      {series && (
        <Carousel>
          {series.map((series, index) => (
            <Series key={index} series={series} />
          ))}
        </Carousel>
      )}

      {!series && <Spinner color="primary" size="2x" justifyContent="center" />}
    </SeriesRecentlyAddedStyled>
  );
};

export { SeriesRecentlyAdded };
