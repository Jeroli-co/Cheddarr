import React from "react";
import styled, { css } from "styled-components";

const MediaPreviewCardStyle = styled.div`
  position: relative;
  min-width: 10vw;
  max-width: 10vw;
  height: 100%;
  cursor: pointer;
  transition: 0.5s ease;
  margin-right: 5px;
  margin-left: 5px;

  @media only screen and (max-width: 1024px) {
    min-width: 30vw;
    max-width: 30vw;
  }

  .media-image {
    display: block;
    width: 100%;
    min-height: 100%;
    max-height: 100%;
    opacity: 1;
  }

  .media-title {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    visibility: hidden;
    color: white;

    border-top: 2px solid ${(props) => props.theme.primary};
    border-left: 2px solid ${(props) => props.theme.primary};
    border-right: 2px solid ${(props) => props.theme.primary};
    ${(props) =>
      !props.oneIsActive &&
      css`
        border-bottom: 2px solid ${props.theme.primary};
      `}

    background: rgba(0, 0, 0, 0.5);
  }

  &:hover {
    .media-title {
      visibility: visible;
    }
  }

  ${(props) =>
    props.isActive &&
    css`
      .media-title {
        visibility: visible;
      }
    `}
`;

const ArrowUp = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 0;
  width: 0;
  height: 0;
  border-left: 12px solid transparent;
  border-right: 12px solid transparent;
  border-bottom: 12px solid ${(props) => props.theme.primary};
  visibility: ${(props) => (props.isActive ? "visible" : "hidden")};
`;

const MediaPreview = ({ media, isActive, oneIsActive, _onClick }) => {
  return (
    <MediaPreviewCardStyle
      isActive={isActive}
      oneIsActive={oneIsActive}
      onClick={() => _onClick()}
    >
      <img
        className="media-image"
        src={
          media.type === "movie"
            ? media.thumbUrl
            : media.type === "episode"
            ? media.seasonThumbUrl
            : ""
        }
        alt={
          media.title.length <= 20
            ? media.title
            : media.title.slice(0, 20) + "..."
        }
      />
      <div className="media-title is-size-5-tablet is-size-7-mobile">
        {media.type === "movie" && media.title}
        {media.type === "episode" && (
          <div>
            <p>{media.seriesTitle}</p>
            <p>
              S{media.seasonNumber} ・ E{media.episodeNumber}
            </p>
          </div>
        )}
      </div>
      <ArrowUp isActive={isActive} />
    </MediaPreviewCardStyle>
  );
};

export { MediaPreview };