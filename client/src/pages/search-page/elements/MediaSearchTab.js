import React from "react";
import { SEARCH_TYPES } from "../../../enums/SearchTypes";
import { OnlineMovieCard } from "./OnlineMovieCard";
import { OnlineSeriesCard } from "./OnlineSeriesCard";

const MediaSearchTab = ({ data }) => {
  return data.map((media, index) => {
    switch (media["media_type"]) {
      case SEARCH_TYPES.MOVIES:
        return <OnlineMovieCard key={index} movie={media} />;
      case SEARCH_TYPES.SERIES:
        return <OnlineSeriesCard key={index} series={media} />;
      default:
        console.log("No type matched");
        break;
    }
  });
};

export { MediaSearchTab };
