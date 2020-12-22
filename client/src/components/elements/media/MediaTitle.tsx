import React from "react";
import { TITLE_SIZES } from "../../../utils/strings";
import { Text } from "../Text";
import { routes } from "../../../router/routes";
import { Link } from "react-router-dom";
import {
  IMediaServerEpisode,
  IMediaServerMedia,
  IMediaServerMovie,
  IMediaServerSeason,
  IMediaServerSeries,
  isMediaServerEpisode,
  isMediaServerSeason,
} from "../../../models/IMediaServerMedia";
import { MediasTypes } from "../../../enums/MediasTypes";

type MediaTitleProps = {
  media:
    | IMediaServerMedia
    | IMediaServerMovie
    | IMediaServerSeries
    | IMediaServerEpisode
    | IMediaServerSeason;
};

const MediaTitle = ({ media }: MediaTitleProps) => {
  switch (media.type) {
    case MediasTypes.SERIES:
    case MediasTypes.MOVIES:
      return (
        <Text fontSize={TITLE_SIZES.one} fontWeight="500">
          {media.title}
        </Text>
      );
    case MediasTypes.SEASONS:
      if (isMediaServerSeason(media)) {
        return (
          <Text fontSize={TITLE_SIZES.one} fontWeight="500">
            <Link to={routes.SERIES.url(media.seriesId.toString())}>
              {media.seriesTitle}
            </Link>{" "}
            - Season {media.seasonNumber}
          </Text>
        );
      }
      break;
    case MediasTypes.EPISODES:
      if (isMediaServerEpisode(media)) {
        return (
          <div>
            <Text fontSize={TITLE_SIZES.one} fontWeight="500">
              <Link to={routes.SERIES.url(media.seriesId.toString())}>
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
      }
      break;
    default:
      throw new Error("No media type matched");
  }

  return <div>Error</div>;
};

export { MediaTitle };
