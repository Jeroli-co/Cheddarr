import React from "react";
import styled from "styled-components";

const MediaBackgroundContainerStyle = styled.div`
  position: relative;
  min-width: 100%;
  max-width: 100%;
  background-color: white;
  z-index: 0;
`;

const MediaBackgroundStyle = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: white;
  z-index: -2;
`;

const MediaBackgroundImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('${(props) => props.backgroundImage}');
  background-repeat: no-repeat;
  background-position: 0 0;
  background-size: cover;
  opacity: 0.2;
  z-index: -1;
`;

const MediaBackground = ({ image, children }) => {
  return (
    <MediaBackgroundContainerStyle>
      {children}
      <MediaBackgroundImage backgroundImage={image} />
      <MediaBackgroundStyle />
    </MediaBackgroundContainerStyle>
  );
};

export { MediaBackground };