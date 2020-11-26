import React, { useEffect, useRef, useState, MouseEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { Carousel } from "../../../../utils/elements/Carousel";
import { MediaExtendedCardLayout } from "./elements/MediaExtendedCardLayout";
import { MediaPreviewCard } from "./elements/MediaPreviewCard";
import Spinner from "../../../../utils/elements/Spinner";
import { MediaRecentlyAddedType } from "./enums/MediaRecentlyAddedType";
import { PlexService } from "../../plex/services/PlexService";
import { IMediaServerMedia } from "../../models/IMediaServerMedia";

type MediaRecentlyAddedProps = {
  type: MediaRecentlyAddedType;
};

const MediaRecentlyAdded = ({ type }: MediaRecentlyAddedProps) => {
  const [media, setMedia] = useState<IMediaServerMedia[] | null>(null);
  const [isShow, setIsShow] = useState(true);
  const [mediaSelectedIndex, setMediaSelectedIndex] = useState(-1);
  const sectionTitleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    PlexService.GetMediaRecentlyAdded(type).then((res) => {
      if (res.error === null) {
        setMedia(res.data);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPreviewClick = (index: number) => {
    if (sectionTitleRef && sectionTitleRef.current) {
      setMediaSelectedIndex(index);
      sectionTitleRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  };

  const collapseWidget = (e: MouseEvent) => {
    setIsShow(!isShow);
    setMediaSelectedIndex(-1);
    e.preventDefault();
  };

  if (media === null) {
    return <Spinner />;
  }

  return (
    <div data-testid="MediaRecentlyAdded">
      <div
        ref={sectionTitleRef}
        className="is-pointed"
        onClick={collapseWidget}
      >
        <div>
          <p className="is-size-4 has-text-primary has-text-weight-semibold">
            {type === "movies" && "Movies recently added"}
            {type === "series" && "Series recently added"}
            {type === "onDeck" && "On Deck"}
          </p>
          {(!media && <Spinner color="primary" />) || (
            <p className="is-size-4 has-text-primary has-text-weight-semibold">
              {(isShow && <FontAwesomeIcon icon={faAngleDown} />) || (
                <FontAwesomeIcon icon={faAngleRight} />
              )}
            </p>
          )}
        </div>
      </div>

      {media && isShow && (
        <Carousel>
          {media.map((m, index) => (
            <div id={m.id.toString()} key={index}>
              <MediaPreviewCard
                media={m}
                isActive={mediaSelectedIndex === index}
                oneIsActive={mediaSelectedIndex !== -1}
                onPreviewClick={() => onPreviewClick(index)}
              />
            </div>
          ))}
        </Carousel>
      )}

      {mediaSelectedIndex !== -1 && (
        <MediaExtendedCardLayout
          media={media[mediaSelectedIndex]}
          onClose={() => setMediaSelectedIndex(-1)}
        />
      )}
    </div>
  );
};

export { MediaRecentlyAdded };
