import React from "react";
import styled from "styled-components";
import {
  getColorRating,
  getRatingPercentage,
} from "../../../../utils/media-utils";
import {
  IMediaServerEpisode,
  IMediaServerMovie,
  IMediaServerSeason,
  IMediaServerSeries,
} from "../models/IMediasServerMedias";
import {
  ISearchedMovie,
  ISearchedSeries,
} from "../../search/models/ISearchedMedias";

const RatingStyle = styled.div<{ backgroundColor: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  background-color: ${(props) => props.backgroundColor};
`;

type MediaRatingProps = {
  media:
    | IMediaServerEpisode
    | IMediaServerSeries
    | IMediaServerMovie
    | IMediaServerSeason
    | ISearchedSeries
    | ISearchedMovie;
};

const MediaRating = ({ media }: MediaRatingProps) => {
  if (!media || !media.rating) return <div />;

  return (
    <RatingStyle
      data-tooltip="MediaRating"
      style={{ cursor: "default" }}
      backgroundColor={getColorRating(getRatingPercentage(media.rating))}
    >
      {getRatingPercentage(media.rating) + "%"}
    </RatingStyle>
  );
};

export { MediaRating };
