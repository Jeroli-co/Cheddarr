import React, { useEffect, useState } from "react";
import { Container } from "../../../../utils/elements/Container";
import { RowLayout } from "../../../../utils/elements/layouts";
import { Image } from "../../../../utils/elements/Image";
import { MediaRating } from "../../../../utils/elements/media/MediaRating";
import { MediaRequestButton } from "./MediaRequestButton";
import { ProvidersDropdown } from "./ProvidersDropdown";
import { MEDIA_TYPES } from "../../../media/enums/MediaTypes";
import { H3 } from "../../../../utils/elements/titles";
import { Button } from "../../../../utils/elements/buttons/Button";
import { PrimaryButton } from "../../../../utils/elements/buttons/PrimaryButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { ButtonsGroup } from "../../../../utils/elements/buttons/ButtonsGroup";
import { Dropdown } from "../../../../utils/elements/buttons/Dropdown";

const OnlineMovieCard = ({ movie, friendsProviders }) => {
  const [providerSelected, setProviderSelected] = useState(null);

  useEffect(() => {
    if (friendsProviders.length > 0) {
      setProviderSelected(friendsProviders[0]);
    }
  }, [friendsProviders]);

  const handleChanges = (event) => {
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
          src={movie["thumbUrl"]}
          alt={movie.title}
          width="12%"
          borderRadius="12px"
        />
        <Container width="100%" padding="1%">
          <RowLayout justifyContent="space-between" alignItems="center">
            <H3>{movie.title}</H3>
            <ProvidersDropdown
              providers={friendsProviders}
              handleChanges={handleChanges}
            />
            {providerSelected && (
              <MediaRequestButton
                requested_username={providerSelected.username}
                media_type={MEDIA_TYPES.MOVIES}
                request_body={{ tmdb_id: movie.tmdb_id }}
              />
            )}
            <MediaRating media={movie} />
          </RowLayout>
          <div>
            {movie["releaseDate"] && (
              <p
                className="is-size-7"
                style={{ cursor: "default" }}
                data-tooltip="Released"
              >
                {movie["releaseDate"]}
              </p>
            )}
          </div>
          {movie.summary && (
            <RowLayout marginTop="1em">
              <div>
                <div className="is-size-5">Overview</div>
                <div className="is-size-6">{movie.summary}</div>
              </div>
            </RowLayout>
          )}
        </Container>
      </RowLayout>
    </Container>
  );
};

export { OnlineMovieCard };
