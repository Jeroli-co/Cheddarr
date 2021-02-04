import React from "react";
import styled from "styled-components";
import {
  IMediaServerEpisode,
  IMediaServerMedia,
  isMediaServerEpisode,
} from "../models/IMediaServerMedia";

const MediaPreviewCardStyle = styled.div`
  position: relative;
  min-width: 12vw;
  max-width: 12vw;
  min-height: calc(12vw + (12vw / 3));
  max-height: calc(12vw + (12vw / 3));
  height: 100%;
  cursor: pointer;
  transition: 0.5s ease;
  margin-right: 5px;
  margin-left: 5px;
  filter: brightness(125%);

  @media only screen and (max-width: 1024px) {
    min-width: 30vw;
    max-width: 30vw;
    min-height: calc(30vw + (30vw / 3));
    max-height: calc(30vw + (30vw / 3));
  }

  .media-image {
    display: block;
    width: 100%;
    min-height: 100%;
    max-height: 100%;
    opacity: 1;
    border-radius: 12px;
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
    padding: 20px;

    border-top: 2px solid ${(props) => props.theme.primary};
    border-left: 2px solid ${(props) => props.theme.primary};
    border-right: 2px solid ${(props) => props.theme.primary};
    border-bottom: 2px solid ${(props) => props.theme.primary};

    background: rgba(0, 0, 0, 0.5);
    border-radius: 12px;
  }

  &:hover {
    .media-title {
      visibility: visible;
    }
  }
`;

type MediaPreviewCardProps = {
  media: IMediaServerMedia | IMediaServerEpisode;
};

export const MediaPreviewCard = ({ media }: MediaPreviewCardProps) => {
  return (
    <MediaPreviewCardStyle>
      <img className="media-image" src={media.posterUrl} alt="" />
      <div className="media-title is-size-5-tablet is-size-7-mobile">
        <div>
          <p>
            {(isMediaServerEpisode(media) && media.seriesTitle) || media.title}
          </p>
          {isMediaServerEpisode(media) && (
            <div>
              <br />

              <p>
                S{media.seasonNumber}・E{media.episodeNumber}
              </p>
              <br />
              <p>{media.title}</p>
            </div>
          )}
        </div>
      </div>
    </MediaPreviewCardStyle>
  );
};
