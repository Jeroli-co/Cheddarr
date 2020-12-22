import React from "react";
import { MovieCard } from "./MovieCard";
import { SeriesCard } from "./SeriesCard";
import { EpisodeCard } from "./EpisodeCard";
import {
  IMediaServerMedia,
  isMediaServerEpisode,
  isMediaServerMovie,
  isMediaServerSeries,
} from "../../../models/IMediaServerMedia";
import { MediasTypes } from "../../../enums/MediasTypes";

type MediaCardProps = {
  media: IMediaServerMedia;
};

const MediaCard = ({ media }: MediaCardProps) => {
  switch (media.type) {
    case MediasTypes.MOVIES:
      return isMediaServerMovie(media) ? <MovieCard movie={media} /> : <div />;
    case MediasTypes.SERIES:
      return isMediaServerSeries(media) ? (
        <SeriesCard series={media} />
      ) : (
        <div />
      );
    case MediasTypes.EPISODES:
      return isMediaServerEpisode(media) ? (
        <EpisodeCard episode={media} />
      ) : (
        <div />
      );
    default:
      return <div />;
  }
};

export { MediaCard };
