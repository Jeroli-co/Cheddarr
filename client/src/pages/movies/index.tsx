import * as React from "react";
import { useParams } from "react-router";
import { Media } from "../../shared/components/media/Media";
import { useMovie } from "../../hooks/useMovie";

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useMovie(id);

  if (isLoading) {
    return undefined;
  }

  return <Media media={data} />;
};
