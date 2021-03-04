import React, { useState } from "react";
import styled from "styled-components";
import { MediaTypes } from "../../enums/MediaTypes";
import { MovieTag, SeriesTag } from "../Tag";
import { IMedia, isOnServers } from "../../models/IMedia";
import { PrimaryButton } from "../Button";
import { Icon } from "../Icon";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { RequestMediaModal } from "./RequestMediaModal";
import { SeriesRequestOptionsContextProvider } from "../../contexts/SeriesRequestOptionsContext";
import { STATIC_STYLES } from "../../enums/StaticStyles";

const Container = styled.div`
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
`;

type MediaPreviewCardProps = {
  media: IMedia;
};

export const MediaPreviewCardGrid = ({ media }: MediaPreviewCardProps) => {
  const [isRequestMediaModalOpen, setIsRequestMediaModalOpen] = useState(false);

  return (
    <Container>
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
            type="button"
            width="100%"
            onClick={() => setIsRequestMediaModalOpen(true)}
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
      {isRequestMediaModalOpen && (
        <SeriesRequestOptionsContextProvider>
          <RequestMediaModal
            media={media}
            closeModal={() => setIsRequestMediaModalOpen(false)}
          />
        </SeriesRequestOptionsContextProvider>
      )}
    </Container>
  );
};
