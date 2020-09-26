import React from "react";
import { MovieCard } from "./MovieCard";
import { SeriesCard } from "./SeriesCard";
import { EpisodeCard } from "./EpisodeCard";

const MediaCard = ({ media }) => {
  switch (media.type) {
    case "movie":
      return <MovieCard movie={media} />;
    case "series":
      return <SeriesCard series={media} />;
    case "seasons":
      return;
    case "episode":
      return <EpisodeCard episode={media} />;
    default:
      throw new Error("No type matched");
  }
};

export { MediaCard };
