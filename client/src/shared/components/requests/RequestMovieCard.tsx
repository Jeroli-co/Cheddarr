import React from "react";
import { useFriendsMoviesProviders } from "../../hooks/useFriendsMoviesProviders";
import { FriendsProvidersDropdown } from "./FriendsProvidersDropdown";
import { Spinner } from "../Spinner";
import { ComponentSizes } from "../../enums/ComponentSizes";

export const RequestMovieCard = () => {
  const friendsMoviesProviders = useFriendsMoviesProviders();

  return (
    <div>
      {friendsMoviesProviders.isLoading && (
        <Spinner size={ComponentSizes.LARGE} />
      )}
      {!friendsMoviesProviders.isLoading &&
        friendsMoviesProviders.data &&
        friendsMoviesProviders.data?.length > 0 && (
          <FriendsProvidersDropdown users={friendsMoviesProviders.data} />
        )}
      {!friendsMoviesProviders.isLoading &&
        friendsMoviesProviders.data &&
        friendsMoviesProviders.data?.length === 0 && (
          <p>You have no friend to request</p>
        )}
    </div>
  );
};
