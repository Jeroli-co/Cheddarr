import React, { useEffect, useState } from "react";
import { Container } from "../../../../shared/components/Container";
import { RowLayout } from "../../../../shared/components/Layouts";
import { Image } from "../../../../shared/components/Image";
import { MediaRating } from "../../plex-media/components/MediaRating";
import { ProvidersDropdown } from "./ProvidersDropdown";
import { H3 } from "../../../../shared/components/Titles";
import { MediaRequestButton } from "./MediaRequestButton";
import { IPublicUser } from "../../../models/IPublicUser";
import { ISearchedMovie } from "../models/ISearchedMedias";
import { MediaTypes } from "../../../enums/MediaTypes";

type SearchedMoviesCardProps = {
  movie: ISearchedMovie;
  friendsProviders: IPublicUser[];
};

const SearchedMovieCard = ({
  movie,
  friendsProviders,
}: SearchedMoviesCardProps) => {
  const [providerSelected, setProviderSelected] = useState<IPublicUser | null>(
    null
  );

  useEffect(() => {
    if (friendsProviders.length > 0) {
      setProviderSelected(friendsProviders[0]);
    }
  }, [friendsProviders]);

  const handleProviderChanges = (provider: IPublicUser) => {
    setProviderSelected(provider);
  };

  return (
    <Container
      padding="1%"
      margin="1%"
      border="1px solid black"
      borderRadius="12px"
    >
      <RowLayout alignItems="flex-start">
        {movie.posterUrl && (
          <Image
            src={movie.posterUrl}
            alt={movie.title}
            width="12%"
            borderRadius="12px"
          />
        )}
        <Container width="100%" padding="1%">
          <RowLayout justifyContent="space-between" alignItems="center">
            <H3>{movie.title}</H3>
            <ProvidersDropdown
              providers={friendsProviders}
              handleChanges={handleProviderChanges}
            />
            {providerSelected && (
              <MediaRequestButton
                mediasType={MediaTypes.MOVIES}
                requestCreate={{
                  tmdbId: movie.tmdbId,
                  requestedUsername: providerSelected.username,
                }}
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

export { SearchedMovieCard };
