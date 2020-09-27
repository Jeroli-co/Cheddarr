import React, { useEffect, useState } from "react";
import { Container } from "../../../../utils/elements/Container";
import { RowLayout } from "../../../../utils/elements/layouts";
import { Image } from "../../../../utils/elements/Image";
import { MediaRating } from "../../../../utils/elements/media/MediaRating";
import { ProvidersDropdown } from "./ProvidersDropdown";
import { MediaRequestButton } from "./MediaRequestButton";
import { MEDIA_TYPES } from "../../../media/enums/MediaTypes";
import { SeasonsMenu } from "./SeasonsMenu";

const OnlineSeriesCard = ({ media, friendsProviders }) => {
  const [providerSelected, setProviderSelected] = useState(null);

  useEffect(() => {
    if (friendsProviders.length > 0) {
      setProviderSelected(friendsProviders[0]);
    }
  }, [friendsProviders]);

  const handleChange = (event) => {
    setProviderSelected(event.target.value);
  };

  return (
    <Container
      padding="1%"
      margin="1%"
      border="1px solid black"
      borderRadius="12px"
    >
      <RowLayout alignItems="flex-start">
        <Image
          src={media["thumbUrl"]}
          alt={media.title}
          width="12%"
          borderRadius="12px"
        />
        <Container width="100%" padding="1%">
          <RowLayout justifyContent="space-between" alignItems="center">
            <h1 className="title is-3">{media.title}</h1>
            <ProvidersDropdown
              providers={friendsProviders}
              handleChange={handleChange}
            />
            {providerSelected && (
              <MediaRequestButton
                requested_username={providerSelected.username}
                media_type={MEDIA_TYPES.SERIES}
                media_id={media.id}
              />
            )}
            <MediaRating media={media} />
          </RowLayout>
          <div>
            {media["releaseDate"] && (
              <p
                className="is-size-7"
                style={{ cursor: "default" }}
                data-tooltip="Released"
              >
                {media["releaseDate"]}
              </p>
            )}
          </div>
          {media.summary && (
            <RowLayout marginTop="1em">
              <div>
                <div className="is-size-5">Overview</div>
                <div className="is-size-6">{media.summary}</div>
              </div>
            </RowLayout>
          )}
        </Container>
      </RowLayout>
      <div className="is-divider" />
      <SeasonsMenu series_id={media.id} />
    </Container>
  );
};

export { OnlineSeriesCard };
