import React from "react";
import { SEARCH_TYPES } from "../../../enums/SearchTypes";
import { MovieCard } from "../../../elements/media/MovieCard";
import { SeriesCard } from "../../../elements/media/SeriesCard";

const MediaSearchTab = ({ data }) => {
  return data.map((media) => {
    switch (media["media_type"]) {
      case SEARCH_TYPES.MOVIES:
        return <MovieCard movie={media} />;
      case SEARCH_TYPES.SERIES:
        return <SeriesCard series={media} />;
      default:
        console.log("No type matched");
        break;
    }
  });
};

export { MediaSearchTab };
