import React from "react";
import styled from "styled-components";
import {
  IMediaServerEpisode,
  IMediaServerMedia,
  isMediaServerEpisode,
} from "../models/IMediaServerMedia";
import { MediaTypes } from "../../../enums/MediaTypes";
import { MovieTag, SeriesTag } from "./Tag";

const MediaPreviewCardStyle = styled.div`
  position: relative;
  min-width: calc(10vw - 15px);
  max-width: calc(10vw - 15px);
  min-height: calc(10vw + (10vw / 3));
  max-height: calc(10vw + (10vw / 3));
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

  .is-played {
    position: absolute;
    bottom: 0;
    background: ${(props) => props.theme.black};
    border-radius: 12px;
    font-size: 10px;
    display: flex;
    justify-content: center;
    left: 50%;
    transform: translateX(-50%);
    padding: 2px 5px;
  }

  .media-image {
    display: block;
    width: 100%;
    min-height: 100%;
    max-height: 100%;
    opacity: 1;
    border-radius: 12px;
  }

  .is-played {
    position: absolute;
    right: 5px;
    bottom: 5px;
    z-index: 10;
  }

  .media-hover-info {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
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
    border: 3px solid ${(props) => props.theme.secondary};
    background: rgba(0, 0, 0, 0.8);
    border-radius: 12px;
  }

  &:hover {
    .media-hover-info {
      visibility: visible;
    }

    .is-played {
      visibility: hidden;
    }
  }

  p {
    &:nth-child(2) {
      font-weight: bold;
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
      {!media.isWatched && <span className="is-played">Unplayed</span>}
      <div className="media-hover-info">
        <p>{new Date(media.releaseDate).getFullYear()}</p>
        <p>
          {(isMediaServerEpisode(media) && media.seriesTitle) || media.title}
        </p>
        {isMediaServerEpisode(media) && (
          <p>
            S{media.seasonNumber}・E{media.episodeNumber}
          </p>
        )}
        {isMediaServerEpisode(media) && <p>{media.title}</p>}
        <span className="media-type">
          {(media.type === MediaTypes.MOVIES ||
            media.type === MediaTypes.MOVIE) && <MovieTag />}
          {(media.type === MediaTypes.EPISODE ||
            media.type === MediaTypes.EPISODES) && <SeriesTag />}
        </span>
      </div>
    </MediaPreviewCardStyle>
  );
};
