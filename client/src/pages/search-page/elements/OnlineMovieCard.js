import React, { useEffect, useState } from "react";
import { Container } from "../../../elements/Container";
import { RowLayout } from "../../../elements/layouts";
import { Image } from "../../../elements/Image";
import { MediaRating } from "../../../elements/media/MediaRating";
import { MediaRequest } from "./MediaRequest";
import { ProvidersDropdown } from "./ProvidersDropdown";

const OnlineMovieCard = ({ movie, friendsProviders }) => {
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
          src={movie["thumbUrl"]}
          alt={movie.title}
          width="12%"
          borderRadius="12px"
        />
        <Container width="100%" padding="1%">
          <RowLayout justifyContent="space-between" alignItems="center">
            <h1 className="title is-3">{movie.title}</h1>
            <ProvidersDropdown
              providers={friendsProviders}
              handleChange={handleChange}
            />
            <MediaRequest userProvider={providerSelected} media={movie} />
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
