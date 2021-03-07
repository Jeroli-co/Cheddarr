import React, { useState, MouseEvent } from "react";
import styled, { css } from "styled-components";
import { MediaTypes } from "../../enums/MediaTypes";
import { MovieTag, SeriesTag } from "../Tag";
import { IMedia, isOnServers } from "../../models/IMedia";
import { PrimaryButton } from "../Button";
import { Icon } from "../Icon";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { RequestMediaModal } from "./RequestMediaModal";
import { SeriesRequestOptionsContextProvider } from "../../contexts/SeriesRequestOptionsContext";
import { STATIC_STYLES } from "../../enums/StaticStyles";
import { useHistory } from "react-router-dom";
import { routes } from "../../../router/routes";

const Container = styled.div<{
  hasPoster: boolean;
  size?: { width: number; height: number };
}>`
  position: relative;
  flex: 0 0 calc(16.66% - 10px);
  cursor: pointer;
  margin: 5px;

  @media screen and (max-width: ${STATIC_STYLES.TABLET_MAX_WIDTH}px) {
    flex: 0 0 calc(25% - 10px);
  }

  @media screen and (max-width: ${STATIC_STYLES.MOBILE_MAX_WIDTH}px) {
    flex: 0 0 100%;
    margin: 0 0 10px 0;
  }

  .media-is-present {
    position: absolute;
    top: 10px;
    right: 10px;
    background: ${(props) => props.theme.success};
    color: ${(props) => props.theme.white};
    border: 1px solid ${(props) => props.theme.white};
    border-radius: 50%;
    width: 20px;
    height: 20px;
    font-size: 10px;
    padding: 10px;

    span {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }

  .media-image {
    display: block;
    width: 100%;
    height: 100%;
    opacity: 1;
    border-radius: 12px;
  }

  .media-hover-info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    text-align: center;
    padding: 15px;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    opacity: 0;
    color: white;
    border: 3px solid ${(props) => props.theme.secondary};
    background: rgba(0, 0, 0, 0.8);
    border-radius: 12px;
    transition: opacity 0.4s ease;
  }

  &:hover {
    .media-hover-info {
      opacity: 1;
    }
  }

  p {
    &:nth-child(2) {
      font-weight: bold;
    }
  }

  ${(props) =>
    !props.hasPoster &&
    props.size &&
    css`
      .media-hover-info {
        width: ${props.size.width}px;
        height: ${props.size.height}px;
        opacity: 1;
        border: 1px solid black;
      }
    `}
`;

type MediaPreviewCardProps = {
  media: IMedia;
  size?: {
    width: number;
    height: number;
  };
};

export const MediaPreviewCardGrid = ({
  media,
  size,
}: MediaPreviewCardProps) => {
  const [isRequestMediaModalOpen, setIsRequestMediaModalOpen] = useState(false);
  const history = useHistory();

  const onCardClick = (e: MouseEvent<HTMLDivElement>) => {
    history.push(
      media.mediaType === MediaTypes.MOVIES
        ? routes.MOVIE.url(media.tmdbId.toString())
        : routes.SERIES.url(media.tmdbId.toString())
    );
  };

  const onRequestClick = (e: MouseEvent<HTMLButtonElement>) => {
    setIsRequestMediaModalOpen(true);
    e.stopPropagation();
  };

  return (
    <>
      <Container
        hasPoster={!!media.posterUrl}
        size={size}
        onClick={(e) => onCardClick(e)}
      >
        <img className="media-image" src={media.posterUrl} alt="" />
        {isOnServers(media) && (
          <span className="media-is-present">
            <span>
              <Icon icon={faCheck} />
            </span>
          </span>
        )}
        <div className="media-hover-info">
          <span className="media-type">
            {media.mediaType === MediaTypes.MOVIES && <MovieTag />}
            {media.mediaType === MediaTypes.SERIES && <SeriesTag />}
          </span>
          <p>{media.title}</p>
          {media.releaseDate && (
            <p>{new Date(media.releaseDate).getFullYear()}</p>
          )}
          {!isOnServers(media) && (
            <PrimaryButton
              className="request-button"
              type="button"
              width="100%"
              onClick={(e) => onRequestClick(e)}
            >
              Request
            </PrimaryButton>
          )}
          {isOnServers(media) && (
            <PrimaryButton type="button" width="100%">
              Play
            </PrimaryButton>
          )}
        </div>
      </Container>
      {isRequestMediaModalOpen && (
        <SeriesRequestOptionsContextProvider>
          <RequestMediaModal
            media={media}
            closeModal={() => setIsRequestMediaModalOpen(false)}
          />
        </SeriesRequestOptionsContextProvider>
      )}
    </>
  );
};
