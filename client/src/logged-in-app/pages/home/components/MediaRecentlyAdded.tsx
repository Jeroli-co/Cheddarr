import React, { useEffect, useState } from "react";
import { Spinner } from "../../../../shared/components/Spinner";
import { MediaRecentlyAddedType } from "../enums/MediaRecentlyAddedType";
import styled from "styled-components";
import { useAPI } from "../../../../shared/hooks/useAPI";
import {
  DefaultAsyncCall,
  IAsyncCall,
} from "../../../../shared/models/IAsyncCall";
import { SwitchErrors } from "../../../../shared/components/errors/SwitchErrors";
import { faCaretDown, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { Icon } from "../../../../shared/components/Icon";
import { H2 } from "../../../../shared/components/Titles";
import { ComponentSizes } from "../../../../shared/enums/ComponentSizes";
import { CenteredContent } from "../../../../shared/components/layout/CenteredContent";
import { Carousel } from "../../../../shared/components/layout/Carousel";
import { MediaPreviewCard } from "../../../../shared/components/media/MediaPreviewCard";
import { IMedia } from "../../../../shared/models/IMedia";
import { useHistory } from "react-router-dom";

const MediaRecentlyAddedTitleContainer = styled(H2)`
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
  const [media, setMedia] = useState<IAsyncCall<IMedia[] | null>>(
    DefaultAsyncCall
  );
  const { get } = useAPI();
  const [hidden, setHidden] = useState(false);
  const history = useHistory();

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
    get<IMedia[]>("/" + type + "/recent").then((res) => {
      setMedia(res);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (media.isLoading) {
    return (
      <CenteredContent height="280px">
        <Spinner size={ComponentSizes.LARGE} />
      </CenteredContent>
    );
  }

  if (media.status >= 400) {
    return <SwitchErrors status={media.status} />;
  }

  return (
    <div>
      <MediaRecentlyAddedTitleContainer onClick={() => setHidden(!hidden)}>
        {title}
        {hidden && <Icon icon={faCaretRight} />}
        {!hidden && <Icon icon={faCaretDown} />}
      </MediaRecentlyAddedTitleContainer>

      <br />

      {media.data && !hidden && (
        <Carousel>
          {media.data.map((m, index) => (
            <div
              key={index}
              onClick={() => history.push(m.mediaType + "/" + m.tmdbId)}
            >
              <MediaPreviewCard media={m} />
            </div>
          ))}
        </Carousel>
      )}
    </div>
  );
};
