import React from "react";
import styled from "styled-components";

const MediaTitleStyle = styled.h1`
  font-size: 2em;
  font-weight: 500;
  margin: 10px;
`;

const SeriesTitle = ({ series }) => {
  return <MediaTitleStyle>{series.title}</MediaTitleStyle>;
};

const MediaTitle = ({ media }) => {
  switch (media.type) {
    case "series":
      return <SeriesTitle series={media} />;
    default:
      throw new Error("No media type matched");
  }
};

export { MediaTitle };
