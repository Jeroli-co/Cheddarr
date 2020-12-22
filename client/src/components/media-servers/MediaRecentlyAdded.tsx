import React, { useContext, useEffect, useState } from "react";
import { Carousel } from "../elements/Carousel";
import { MediaPreviewCard } from "./MediaPreviewCard";
import Spinner from "../elements/Spinner";
import { MediaRecentlyAddedType } from "../../enums/MediaRecentlyAddedType";
import { PlexService } from "../../services/PlexService";
import { IMediaServerMedia } from "../../models/IMediaServerMedia";
import {
  AsyncResponseError,
  AsyncResponseSuccess,
} from "../../models/IAsyncResponse";
import { PlexConfigContext } from "../../contexts/plex-config/PlexConfigContext";
import { Text } from "../elements/Text";
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

  if (!currentConfig) {
    return (
      <Text isPrimary fontSize="1.5em">
        Add a config plex to see this section
      </Text>
    );
  }

  return (
    <div data-testid="MediaRecentlyAdded">
      <MediaRecentlyAddedTitleContainer>
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
              <MediaPreviewCard media={m} />
            </div>
          ))}
        </Carousel>
      )}
    </div>
  );
};

export { MediaRecentlyAdded };
