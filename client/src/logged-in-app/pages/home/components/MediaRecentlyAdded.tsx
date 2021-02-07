import React, { useContext, useEffect, useState } from "react";
import { Carousel } from "../../plex-media/components/Carousel";
import { MediaPreviewCard } from "../../plex-media/components/MediaPreviewCard";
import { PrimarySpinner } from "../../../../shared/components/Spinner";
import { MediaRecentlyAddedType } from "../enums/MediaRecentlyAddedType";
import { IMediaServerMedia } from "../../plex-media/models/IMediaServerMedia";
import { PlexConfigContext } from "../../../contexts/PlexConfigContext";
import styled, { useTheme } from "styled-components";
import { useRedirectToMediasDetails } from "../../../hooks/useRedirectToMediasDetails";
import { useAPI } from "../../../../shared/hooks/useAPI";
import {
  DefaultAsyncCall,
  IAsyncCall,
} from "../../../../shared/models/IAsyncCall";
import { SwitchErrors } from "../../../../shared/components/errors/SwitchErrors";
import { faCaretDown, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { Icon } from "../../../../shared/components/Icon";
import { H1 } from "../../../../shared/components/Titles";
import { Sizes } from "../../../../shared/enums/Sizes";

const MediaRecentlyAddedTitleContainer = styled(H1)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  color: ${(props) => props.theme.color};
  white-space: nowrap;
`;

type MediaRecentlyAddedProps = {
  type: MediaRecentlyAddedType;
};

export const MediaRecentlyAdded = ({ type }: MediaRecentlyAddedProps) => {
  const [media, setMedia] = useState<IAsyncCall<IMediaServerMedia[] | null>>(
    DefaultAsyncCall
  );
  const { currentConfig } = useContext(PlexConfigContext);
  const { redirectToMediaPage } = useRedirectToMediasDetails();
  const { get } = useAPI();
  const [hidden, setHidden] = useState(false);
  const theme = useTheme();

  let title;
  switch (type) {
    case MediaRecentlyAddedType.MOVIES:
      title = "Movies recently added";
      break;
    case MediaRecentlyAddedType.SERIES:
      title = "Series recently added";
      break;
    case MediaRecentlyAddedType.ON_DECK:
      title = "On Deck";
      break;
    default:
      title = "Undefined";
  }

  useEffect(() => {
    if (currentConfig.data) {
      let url = "/plex/" + currentConfig.data.id;
      if (type === MediaRecentlyAddedType.ON_DECK) {
        url += "/on-deck";
      } else {
        url += "/" + type + "/recent";
      }

      get<IMediaServerMedia[]>(url).then((res) => {
        setMedia(res);
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentConfig]);

  if (media.isLoading) {
    return <PrimarySpinner size={Sizes.LARGE} />;
  }

  if (media.status >= 400) {
    return <SwitchErrors status={media.status} />;
  }

  return (
    <div>
      <MediaRecentlyAddedTitleContainer onClick={() => setHidden(!hidden)}>
        {title}
        {hidden && <Icon icon={faCaretRight} />}
        {!hidden && <Icon icon={faCaretDown} color={theme.primary} />}
      </MediaRecentlyAddedTitleContainer>

      <br />

      {media.data && !hidden && (
        <Carousel>
          {media.data.map((m, index) => (
            <div key={index} onClick={() => redirectToMediaPage(m)}>
              <MediaPreviewCard media={m} />
            </div>
          ))}
        </Carousel>
      )}
    </div>
  );
};
