import React from "react";
import { useParams } from "react-router";

type SeriesParams = {
  id: string;
};

export const Series = () => {
  const { id } = useParams<SeriesParams>();

  return <div />;
};
