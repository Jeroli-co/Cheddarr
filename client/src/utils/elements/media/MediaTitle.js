import React from "react";
import { Text, TITLE_SIZES } from "../../strings";
import { routes } from "../../../router/routes";
import { Link } from "react-router-dom";

const MediaTitle = ({ media }) => {
  switch (media.type) {
    case "series":
    case "movie":
      return (
        <Text fontSize={TITLE_SIZES.one} fontWeight="500">
          {media.title}
        </Text>
      );
    case "season":
      return (
        <Text fontSize={TITLE_SIZES.one} fontWeight="500">
          <Link to={routes.SERIES.url(media.seriesId)}>
            {media.seriesTitle}
          </Link>{" "}
          - Season {media.seasonNumber}
        </Text>
      );
    case "episode":
      return (
        <div>
          <Text fontSize={TITLE_SIZES.one} fontWeight="500">
            <Link to={routes.SERIES.url(media.seriesId)}>
              {media.seriesTitle}
            </Link>{" "}
            - Season {media.seasonNumber} - Episode {media.episodeNumber}
          </Text>
          {media.title && media.title.length > 0 && (
            <Text fontSize={TITLE_SIZES.two} fontWeight="300">
              {media.title}
            </Text>
          )}
        </div>
      );
    default:
      throw new Error("No media type matched");
  }
};

export { MediaTitle };
