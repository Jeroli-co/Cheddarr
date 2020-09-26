import React, { useEffect, useState } from "react";
import { Container } from "../../../elements/Container";
import { RowLayout } from "../../../elements/layouts";
import { Image } from "../../../elements/Image";
import { MediaRating } from "../../../elements/media/MediaRating";
import { ProvidersDropdown } from "./ProvidersDropdown";
import { MediaRequestButton } from "./MediaRequestButton";
import { MEDIA_TYPES } from "../../../modules/media/enums/MediaTypes";

const OnlineSeriesCard = ({ series, friendsProviders }) => {
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
          src={series["thumbUrl"]}
          alt={series.title}
          width="12%"
          borderRadius="12px"
        />
        <Container width="100%" padding="1%">
          <RowLayout justifyContent="space-between" alignItems="center">
            <h1 className="title is-3">{series.title}</h1>
            <ProvidersDropdown
              providers={friendsProviders}
              handleChange={handleChange}
            />
            {providerSelected && (
              <MediaRequestButton
                requested_username={providerSelected.username}
                media_type={MEDIA_TYPES.SERIES}
                media_id={series.id}
              />
            )}
            <MediaRating media={series} />
          </RowLayout>
          <div>
            {series["releaseDate"] && (
              <p
                className="is-size-7"
                style={{ cursor: "default" }}
                data-tooltip="Released"
              >
                {series["releaseDate"]}
              </p>
            )}
          </div>
          {series.summary && (
            <RowLayout marginTop="1em">
              <div>
                <div className="is-size-5">Overview</div>
                <div className="is-size-6">{series.summary}</div>
              </div>
            </RowLayout>
          )}
        </Container>
      </RowLayout>
    </Container>
  );
};

export { OnlineSeriesCard };
