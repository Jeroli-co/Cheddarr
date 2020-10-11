import React, { useEffect, useRef, useState } from "react";
import { usePlex } from "../../providers/plex/hooks/usePlex";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { Carousel } from "../../../utils/elements/Carousel";
import { RowLayout } from "../../../utils/elements/layouts";
import { MediaExtendedCardLayout } from "./elements/MediaExtendedCardLayout";
import { MediaPreview } from "./elements/MediaPreviewCard";
import styled from "styled-components";
import { Spinner } from "../../../utils/elements/Spinner";

const MediaRecentlyAddedStyle = styled.div``;

const MediaRecentlyAdded = ({ type }) => {
  const {
    getMoviesRecentlyAdded,
    getSeriesRecentlyAdded,
    getOnDeck,
  } = usePlex();
  const [medias, setMedias] = useState(null);
  const [isShow, setIsShow] = useState(true);
  const [mediaSelectedIndex, setMediaSelectedIndex] = useState(-1);
  const sectionTitleRef = useRef(null);

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

  const onPreviewClick = (index) => {
    setMediaSelectedIndex(index);
    sectionTitleRef.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  };

  const collapseWidget = () => {
    setIsShow(!isShow);
    setMediaSelectedIndex(-1);
  };

  return (
    <MediaRecentlyAddedStyle data-testid="MediaRecentlyAdded">
      <div
        ref={sectionTitleRef}
        className={!medias ? "" : "is-pointed"}
        onClick={medias ? () => collapseWidget() : null}
      >
        <RowLayout align-items="center" marginTop="2%" childMarginRight="5%">
          <p className="is-size-4 has-text-primary has-text-weight-semibold">
            {type === "movies" && "Movies recently added"}
            {type === "series" && "Series recently added"}
            {type === "onDeck" && "On Deck"}
          </p>
          {(!medias && <Spinner color="primary" />) || (
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
            <div id={media.id} key={index}>
              <MediaPreview
                media={media}
                isActive={mediaSelectedIndex === index}
                oneIsActive={mediaSelectedIndex !== -1}
                _onClick={() => onPreviewClick(index)}
              />
            </div>
          ))}
        </Carousel>
      )}

      {mediaSelectedIndex !== -1 && (
        <MediaExtendedCardLayout
          media={medias[mediaSelectedIndex]}
          onClose={() => setMediaSelectedIndex(-1)}
        />
      )}
    </MediaRecentlyAddedStyle>
  );
};

export { MediaRecentlyAdded };
