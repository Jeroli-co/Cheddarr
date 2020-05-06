import React from "react";
import styled from "styled-components";
import { getColorRating, getRatingPercentage } from "../../utils/media-utils";

const RatingStyle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  background-color: ${(props) => props.backgroundColor};
`;

const MediaRating = ({ media }) => {
  if (!media) return <div />;

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
