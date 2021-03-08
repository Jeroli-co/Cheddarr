import React, { MouseEvent, useState } from "react";
import styled, { css } from "styled-components";
import { MediaTypes } from "../../enums/MediaTypes";
import { MediaTag } from "../Tag";
import {
  IEpisode,
  IMedia,
  ISeason,
  isEpisode,
  isMovie,
  isOnServers,
  isSeason,
  isSeries,
} from "../../models/IMedia";
import { PrimaryButton, PrimaryLinkButton } from "../Button";
import { Icon } from "../Icon";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { RequestMediaModal } from "./RequestMediaModal";
import { SeriesRequestOptionsContextProvider } from "../../contexts/SeriesRequestOptionsContext";
import { STATIC_STYLES } from "../../enums/StaticStyles";
import { useHistory, useLocation } from "react-router-dom";
import { routes } from "../../../router/routes";

const logo = require("../../../assets/cheddarr-min.svg");

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
    css`
      .media-hover-info {
        ${props.size &&
        css`
          width: ${props.size.width}px;
          height: ${props.size.height}px;
        `}
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

export const MediaPreviewCard = ({ media, size }: MediaPreviewCardProps) => {
  const [isRequestMediaModalOpen, setIsRequestMediaModalOpen] = useState(false);
  const history = useHistory();
  const location = useLocation();

  const onCardClick = () => {
    const getSeasonUrl = () => {
      const splitUrl = location.pathname.split("/");
      let url = null;
      if (splitUrl.length > 3) {
        const index = splitUrl.findIndex((s) => s === MediaTypes.SEASONS);
        if (index !== -1 && index + 1 < splitUrl.length) {
          splitUrl[index + 1] = (media as ISeason).seasonNumber.toString();
          if (index + 1 < splitUrl.length - 1) {
            splitUrl.splice(index + 2, splitUrl.length - index + 1);
          }
          url = splitUrl.join("/");
        }
      } else {
        url =
          splitUrl.join("/") + "/seasons/" + (media as ISeason).seasonNumber;
      }
      return url;
    };

    const getEpisodeUrl = () => {
      const splitUrl = location.pathname.split("/");
      let url = null;
      if (splitUrl.length > 5) {
        const index = splitUrl.findIndex((s) => s === MediaTypes.EPISODES);
        if (index !== -1 && index + 1 < splitUrl.length) {
          splitUrl[index + 1] = (media as IEpisode).episodeNumber.toString();
          url = splitUrl.join("/");
        }
      } else {
        url =
          splitUrl.join("/") + "/episodes/" + (media as IEpisode).episodeNumber;
      }
      return url;
    };

    const uri =
      media.mediaType === MediaTypes.MOVIES
        ? routes.MOVIE.url(media.tmdbId)
        : media.mediaType === MediaTypes.SERIES
        ? routes.SERIES.url(media.tmdbId)
        : isSeason(media)
        ? getSeasonUrl()
        : isEpisode(media)
        ? getEpisodeUrl()
        : null;
    if (uri) {
      history.push(uri);
    }
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
        onClick={() => onCardClick()}
      >
        <img
          className="media-image"
          src={media.posterUrl ? media.posterUrl : logo}
          alt=""
        />
        {isOnServers(media) && (
          <span className="media-is-present">
            <span>
              <Icon icon={faCheck} />
            </span>
          </span>
        )}
        <div className="media-hover-info">
          <MediaTag media={media} />
          <p>{media.title}</p>
          {media.releaseDate && (
            <p>{new Date(media.releaseDate).getFullYear()}</p>
          )}
          {((isMovie(media) && !isOnServers(media)) || isSeries(media)) && (
            <PrimaryButton
              className="request-button"
              type="button"
              width="100%"
              onClick={(e) => onRequestClick(e)}
            >
              Request
            </PrimaryButton>
          )}
          {isOnServers(media) &&
            (isMovie(media) || isEpisode(media)) &&
            media.mediaServerInfo &&
            media.mediaServerInfo.length > 0 &&
            media.mediaServerInfo[0].webUrl && (
              <PrimaryLinkButton
                href={media.mediaServerInfo[0].webUrl}
                target="_blank"
              >
                Play
              </PrimaryLinkButton>
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
