import React from "react";
import { useParams } from "react-router";

type MovieParams = {
  id: string;
};

export const Movie = () => {
  const { id } = useParams<MovieParams>();

  return <div />;
};
