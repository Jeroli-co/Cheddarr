import React, { useEffect, useState } from "react";
import { usePlex } from "../hooks/usePlex";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { Carousel } from "../elements/Carousel";
import { Spinner } from "../elements/Spinner";
import styled from "styled-components";
import { MediaPreview } from "../elements/MediaCardComponents";

const MediaRecentlyAddedStyle = styled.section`
  margin: 1em;
`;

const MediaRecentlyAdded = ({ type }) => {
  const {
    getMoviesRecentlyAdded,
    getSeriesRecentlyAdded,
    getOnDeck,
  } = usePlex();
  const [medias, setMedias] = useState(null);
  const [isShow, setIsShow] = useState(true);

  useEffect(() => {
    if (type === "movies") {
      getMoviesRecentlyAdded().then((movies) => {
        if (movies) setMedias(movies);
      });
    } else if (type === "series") {
      getSeriesRecentlyAdded().then((series) => {
        if (series) setMedias(series);
      });
    } else if (type === "onDeck") {
      getOnDeck().then((series) => {
        if (series) setMedias(series);
      });
    } else {
      throw Error("No type matched");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MediaRecentlyAddedStyle data-testid="MediaRecentlyAdded">
      <div className="is-pointed" onClick={() => setIsShow(!isShow)}>
        <div className="level is-mobile">
          <div className="level-left">
            <div className="level-item content">
              <p className="is-size-4 has-text-primary has-text-weight-semibold">
                {type === "movies" && "Movies recently added"}
                {type === "series" && "Series recently added"}
                {type === "onDeck" && "On Deck"}
              </p>
            </div>
          </div>
          <div className="level-right">
            <div className="level-item">
              <p className="is-size-4 has-text-primary has-text-weight-semibold">
                {(isShow && (
                  <FontAwesomeIcon icon={faAngleDown} size="lg" />
                )) || <FontAwesomeIcon icon={faAngleRight} size="lg" />}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="is-divider is-primary" />

      {medias && isShow && (
        <Carousel>
          {medias.map((media, index) => (
            <MediaPreview key={index} media={media} />
          ))}
        </Carousel>
      )}

      {!medias && <Spinner color="primary" size="2x" justifyContent="center" />}
    </MediaRecentlyAddedStyle>
  );
};

export { MediaRecentlyAdded };
