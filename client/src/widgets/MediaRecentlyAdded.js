import React, { useEffect, useState } from "react";
import { usePlex } from "../hooks/usePlex";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { Carousel } from "../elements/Carousel";
import { Spinner } from "../elements/Spinner";
import styled from "styled-components";
import { MediaPreview } from "../elements/MediaCardComponents";
import { RowLayout } from "../elements/layouts";

const MediaRecentlyAddedStyle = styled.section``;

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
      <div
        className={!medias ? "" : "is-pointed"}
        onClick={medias ? () => setIsShow(!isShow) : null}
      >
        <RowLayout
          align-items="center"
          marginBottom="1%"
          childMargin="2%"
          borderBottom="1px solid #f8813f"
        >
          <p className="is-size-4 has-text-primary has-text-weight-semibold">
            {type === "movies" && "Movies recently added"}
            {type === "series" && "Series recently added"}
            {type === "onDeck" && "On Deck"}
          </p>
          {(!medias && <Spinner color="primary" justifyContent="center" />) || (
            <p className="is-size-4 has-text-primary has-text-weight-semibold">
              {(isShow && <FontAwesomeIcon icon={faAngleDown} />) || (
                <FontAwesomeIcon icon={faAngleRight} />
              )}
            </p>
          )}
        </RowLayout>
      </div>

      {medias && isShow && (
        <Carousel>
          {medias.map((media, index) => (
            <MediaPreview key={index} media={media} />
          ))}
        </Carousel>
      )}
    </MediaRecentlyAddedStyle>
  );
};

export { MediaRecentlyAdded };
