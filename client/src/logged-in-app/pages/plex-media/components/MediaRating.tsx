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
} from "../../../../shared/models/IMediaServerMedia";
import {
  ISearchedMovie,
  ISearchedSeries,
} from "../../../../shared/models/ISearchedMedias";

const Container = styled.div<{ backgroundColor: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  background-color: ${(props) => props.backgroundColor};
`;

const RatingValue = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  background-color: ${(props) => props.theme.primary};
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
    <Container
      data-tooltip="MediaRating"
      style={{ cursor: "default" }}
      backgroundColor={getColorRating(getRatingPercentage(media.rating))}
    >
      <RatingValue className="">
        {getRatingPercentage(media.rating) + "%"}
      </RatingValue>
    </Container>
  );
};

export { MediaRating };
