import React, { useContext, useEffect, useRef, useState } from "react";
import { Carousel } from "../../../elements/Carousel";
import { MediaExtendedCardLayout } from "./elements/MediaExtendedCardLayout";
import { MediaPreviewCard } from "./elements/MediaPreviewCard";
import Spinner from "../../../elements/Spinner";
import { MediaRecentlyAddedType } from "./enums/MediaRecentlyAddedType";
import { PlexService } from "../../../../services/PlexService";
import { IMediaServerMedia } from "../../../../models/IMediaServerMedia";
import {
  AsyncResponseError,
  AsyncResponseSuccess,
} from "../../../../models/IAsyncResponse";
import { PlexConfigContext } from "../../../../contexts/plex-config/PlexConfigContext";
import { Text } from "../../../elements/Text";
import styled from "styled-components";

const MediaRecentlyAddedTitleContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

type MediaRecentlyAddedProps = {
  type: MediaRecentlyAddedType;
};

const MediaRecentlyAdded = ({ type }: MediaRecentlyAddedProps) => {
  const [media, setMedia] = useState<IMediaServerMedia[] | null>(null);
  const [mediaSelectedIndex, setMediaSelectedIndex] = useState(-1);
  const sectionTitleRef = useRef<HTMLDivElement>(null);
  const { currentConfig } = useContext(PlexConfigContext);

  useEffect(() => {
    const handleRes = (
      res: AsyncResponseSuccess<IMediaServerMedia[]> | AsyncResponseError
    ) => {
      if (res.error === null) {
        setMedia(res.data);
      }
    };

    if (currentConfig) {
      if (type === MediaRecentlyAddedType.ON_DECK) {
        PlexService.GetMediaOnDeck(currentConfig.id).then((res) => {
          handleRes(res);
        });
      } else {
        PlexService.GetMediaRecentlyAdded(currentConfig.id, type).then(
          (res) => {
            handleRes(res);
          }
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentConfig?.id]);

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

  if (!currentConfig) {
    return (
      <Text isPrimary fontSize="1.5em">
        Add a config plex to see this section
      </Text>
    );
  }

  return (
    <div data-testid="MediaRecentlyAdded">
      <MediaRecentlyAddedTitleContainer ref={sectionTitleRef}>
        <Text isPrimary fontSize="1.5em">
          {type === "movies" && "Movies recently added"}
          {type === "series" && "Series recently added"}
          {type === "onDeck" && "On Deck"}
        </Text>
      </MediaRecentlyAddedTitleContainer>

      <br />

      {!media && <Spinner />}
      {media && (
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

      {media && mediaSelectedIndex !== -1 && (
        <MediaExtendedCardLayout
          media={media[mediaSelectedIndex]}
          onClose={() => setMediaSelectedIndex(-1)}
        />
      )}
    </div>
  );
};

export { MediaRecentlyAdded };
