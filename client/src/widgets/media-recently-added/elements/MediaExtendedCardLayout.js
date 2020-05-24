import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import { MediaCard } from "../../../elements/media/MediaCard";

const MediaExtendedBox = styled.div`
  position: relative;
  min-width: 100%;
  max-width: 100%;
  background: white;
  background-color: rgba(255, 255, 255, 0);
  border-top: 3px solid ${(props) => props.theme.primary};
  z-index: 0;
`;

const MediaExtendedBoxBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: white;
  z-index: -2;
`;

const MediaExtendedBoxBackgroundImage = styled.div`
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

const MediaCollapseBox = styled.div`
  position: absolute;
  top: 0;
  right: 10px;
  color: ${(props) => props.theme.dark};
  font-size: 28px;
  font-weight: bold;
  opacity: 0.6;
  transition: 0.3s ease;
  z-index: 0;

  &:hover,
  &:focus {
    text-decoration: none;
    color: ${(props) => props.theme.dark};
    cursor: pointer;
    opacity: 1;
  }
`;

const MediaExtendedCardLayout = ({ media, onClose }) => {
  return (
    <MediaExtendedBox>
      <MediaCard media={media} />
      <MediaExtendedBoxBackgroundImage backgroundImage={media.artUrl} />
      <MediaExtendedBoxBackground />
      <MediaCollapseBox onClick={() => onClose()}>
        <FontAwesomeIcon icon={faTimes} />
      </MediaCollapseBox>
    </MediaExtendedBox>
  );
};

export { MediaExtendedCardLayout };
