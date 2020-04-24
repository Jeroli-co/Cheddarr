import React, { useEffect, useState } from "react";
import { usePlex } from "../hooks/usePlex";
import { Carousel } from "../elements/Carousel";
import { Spinner } from "../elements/Spinner";
import styled from "styled-components";
import { MediaPreviewCardStyle } from "../elements/medias/MediaPreviewCard";

const Series = ({ series }) => {
  return (
    <div className="Series">
      <MediaPreviewCardStyle>
        <img
          className="series-image"
          src={series.thumbUrl}
          alt="Series poster"
        />
        <p className="series-title">{series.title}</p>
      </MediaPreviewCardStyle>
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
