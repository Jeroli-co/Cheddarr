import React, { useEffect, useState } from "react";
import { usePlex } from "../hooks/usePlex";
import { Carousel } from "../elements/Carousel";
import { Spinner } from "../elements/Spinner";
import styled from "styled-components";
import { MediaStyle } from "./MediaCardStyle";

const Series = ({ series }) => {
  return (
    <div className="Series">
      <MediaStyle>
        <img
          className="series-image"
          src={series.parentThumb}
          alt="Series poster"
        />
        <p className="series-title">{series.title}</p>
      </MediaStyle>
    </div>
  );
};

const SeriesRecentlyAddedStyled = styled.section`
  margin: 1em;
  display: block;
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
          {series.map((series) => (
            <Series key={series.title} series={series} />
          ))}
        </Carousel>
      )}

      {!series && (
        <div className="content has-text-centered has-text-primary">
          <Spinner />
        </div>
      )}
    </SeriesRecentlyAddedStyled>
  );
};

export { SeriesRecentlyAdded };
