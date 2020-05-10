import React from "react";
import styled from "styled-components";

const MediaTitleStyle = styled.h1`
  font-size: 2em;
  font-weight: 500;
  margin: 10px;
`;

const MediaTitle = ({ media }) => {
  switch (media.type) {
    case "series":
    case "movie":
      return <MediaTitleStyle>{media.title}</MediaTitleStyle>;
    default:
      throw new Error("No media type matched");
  }
};

export { MediaTitle };
