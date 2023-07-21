import React from "react";
import { useParams } from "react-router";
import { useMovie } from "../../hooks/useMovie";
import { Media } from "./Media";
import { CenteredContent } from "../layout/CenteredContent";
import { Spinner } from "../Spinner";
import { SwitchErrors } from "../errors/SwitchErrors";

type MovieParams = {
  id: string;
};

export const Movie = () => {
  const { id } = useParams<MovieParams>();
  
  if (!id) {
    throw new Error('Movie needs an ID')
  }
  
  const movie = useMovie(id);

  if (movie.isLoading) {
    return (
      <CenteredContent height="100%">
        <Spinner />
      </CenteredContent>
    );
  }

  if (movie.data === null) {
    return <SwitchErrors status={movie.status} />;
  }

  return (
    <>
      <Media media={movie.data} />
    </>
  );
};

export default Movie