import React, { useContext, useEffect, useState } from "react";
import { Carousel } from "../../plex-media/components/Carousel";
import { MediaPreviewCard } from "../../plex-media/components/MediaPreviewCard";
import Spinner from "../../../../shared/components/Spinner";
import { MediaRecentlyAddedType } from "../enums/MediaRecentlyAddedType";
import { IMediasServerMedias } from "../../plex-media/models/IMediasServerMedias";
import { PlexConfigContext } from "../../../contexts/PlexConfigContext";
import { Text } from "../../../../shared/components/Text";
import styled from "styled-components";
import { useRedirectToMediasDetails } from "../../../hooks/useRedirectToMediasDetails";
import { useAPI } from "../../../../shared/hooks/useAPI";
import {
  DefaultAsyncCall,
  IAsyncCall,
} from "../../../../shared/models/IAsyncCall";
import { SwitchErrors } from "../../../../shared/components/errors/SwitchErrors";

const MediaRecentlyAddedStyle = styled.div`
  min-width: 100vw;
`;

const MediaRecentlyAddedTitleContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

type MediaRecentlyAddedProps = {
  type: MediaRecentlyAddedType;
};

export const MediaRecentlyAdded = ({ type }: MediaRecentlyAddedProps) => {
  const [medias, setMedias] = useState<
    IAsyncCall<IMediasServerMedias[] | null>
  >(DefaultAsyncCall);
  const { currentConfig } = useContext(PlexConfigContext);
  const { redirectToMediaPage } = useRedirectToMediasDetails();
  const { get } = useAPI();

  useEffect(() => {
    if (currentConfig.data) {
      let url = "/plex/" + currentConfig.data.id;
      if (type === MediaRecentlyAddedType.ON_DECK) {
        url += "/on-deck";
      } else {
        url += "/" + type + "/recent";
      }

      get<IMediasServerMedias[]>(url).then((res) => {
        setMedias(res);
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentConfig]);

  if (medias.isLoading) {
    return <Spinner color="primary" />;
  }

  if (medias.status >= 400) {
    return <SwitchErrors status={medias.status} />;
  }

  return (
    <MediaRecentlyAddedStyle>
      <MediaRecentlyAddedTitleContainer>
        <Text paddingLeft="10px" isPrimary fontSize="1.5em">
          {type === MediaRecentlyAddedType.MOVIES && "Movies recently added"}
          {type === MediaRecentlyAddedType.SERIES && "Series recently added"}
          {type === MediaRecentlyAddedType.ON_DECK && "On Deck"}
        </Text>
      </MediaRecentlyAddedTitleContainer>

      <br />

      {medias.data && (
        <Carousel>
          {medias.data.map((m, index) => (
            <div
              id={m.id.toString()}
              key={index}
              onClick={() => redirectToMediaPage(m)}
            >
              <MediaPreviewCard medias={m} />
            </div>
          ))}
        </Carousel>
      )}
    </MediaRecentlyAddedStyle>
  );
};
