import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { MediaTypes } from "../../enums/MediaTypes";
import { MediaTag, SuccessIconTag } from "../Tag";
import {
  IMedia,
  isEpisode,
  isMovie,
  isOnServers,
  isSeason,
  isSeries,
} from "../../models/IMedia";
import { PlayButton } from "../Button";
import { Icon } from "../Icon";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { STATIC_STYLES } from "../../enums/StaticStyles";
import { useHistory, useLocation } from "react-router-dom";
import { routes } from "../../../router/routes";
import { useImage } from "../../hooks/useImage";
import { Image } from "../Image";
import { RequestButton } from "../requests/RequestButton";
import { APIRoutes } from "../../enums/APIRoutes";
import { useAPI } from "../../hooks/useAPI";
import { isEmpty } from "../../../utils/strings";

export const MediaPreviewCardContainer = styled.div`
  position: relative;
  flex: 0 0 calc(16.66% - 10px);
  margin: 5px;
  border-radius: 12px;

  @media screen and (max-width: ${STATIC_STYLES.TABLET_MAX_WIDTH}px) {
    flex: 0 0 calc(25% - 10px);
  }

  @media screen and (max-width: ${STATIC_STYLES.MOBILE_MAX_WIDTH}px) {
    flex: 0 0 45%;
  }

  .media-poster {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 12px;
  }
`;

const Container = styled(MediaPreviewCardContainer)<{
  hasPoster: boolean;
}>`
  cursor: pointer;

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
        opacity: 1;
        border: 1px solid black;
      }
    `}
`;

const HeadContainer = styled.div`
  position: absolute;
  display: flex;
  justify-content: space-between;
  align-items: center;
  top: 0;
  left: 0;
  right: 0;
`;

type MediaPreviewCardProps = {
  media: IMedia;
};

export const MediaPreviewCard = ({ media }: MediaPreviewCardProps) => {
  const [fullyLoadedMedia, setFullyLoadedMedia] = useState<IMedia | null>(null);
  const history = useHistory();
  const location = useLocation();
  const poster = useImage(fullyLoadedMedia && fullyLoadedMedia.posterUrl);
  const { get } = useAPI();

  useEffect(() => {
    if (!media.posterUrl || isEmpty(media.posterUrl)) {
      if (media.mediaType === MediaTypes.MOVIES) {
        get<IMedia>(APIRoutes.GET_MOVIE(media.tmdbId)).then((r) => {
          if (r.data) {
            setFullyLoadedMedia(r.data);
          }
        });
      } else if (media.mediaType === MediaTypes.SERIES) {
        get<IMedia>(APIRoutes.GET_SERIES(media.tmdbId)).then((r) => {
          if (r.data) {
            setFullyLoadedMedia(r.data);
          }
        });
      }
    } else {
      setFullyLoadedMedia(media);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [media]);

  const onCardClick = () => {
    const getSeasonUrl = () => {
      let url = null;
      if (isSeason(fullyLoadedMedia)) {
        const splitUrl = location.pathname.split("/");
        if (splitUrl.length > 3) {
          const index = splitUrl.findIndex((s) => s === MediaTypes.SEASONS);
          if (index !== -1 && index + 1 < splitUrl.length) {
            splitUrl[index + 1] = fullyLoadedMedia.seasonNumber.toString();
            if (index + 1 < splitUrl.length - 1) {
              splitUrl.splice(index + 2, splitUrl.length - index + 1);
            }
            url = splitUrl.join("/");
          }
        } else {
          url =
            splitUrl.join("/") + "/seasons/" + fullyLoadedMedia.seasonNumber;
        }
      }
      return url;
    };

    const getEpisodeUrl = () => {
      let url = null;
      if (isEpisode(fullyLoadedMedia)) {
        const splitUrl = location.pathname.split("/");
        if (splitUrl.length > 5) {
          const index = splitUrl.findIndex((s) => s === MediaTypes.EPISODES);
          if (index !== -1 && index + 1 < splitUrl.length) {
            splitUrl[index + 1] = fullyLoadedMedia.episodeNumber.toString();
            url = splitUrl.join("/");
          }
        } else {
          url =
            splitUrl.join("/") + "/episodes/" + fullyLoadedMedia.episodeNumber;
        }
      }
      return url;
    };

    const uri = fullyLoadedMedia
      ? fullyLoadedMedia.mediaType === MediaTypes.MOVIES
        ? routes.MOVIE.url(fullyLoadedMedia.tmdbId)
        : fullyLoadedMedia.mediaType === MediaTypes.SERIES
        ? routes.SERIES.url(fullyLoadedMedia.tmdbId)
        : isSeason(fullyLoadedMedia)
        ? getSeasonUrl()
        : isEpisode(fullyLoadedMedia)
        ? getEpisodeUrl()
        : null
      : null;

    if (uri) {
      history.push(uri);
    }
  };

  if (!fullyLoadedMedia) {
    return <div />;
  }

  return (
    <>
      <Container
        hasPoster={!!fullyLoadedMedia.posterUrl}
        onClick={() => onCardClick()}
      >
        {fullyLoadedMedia.posterUrl && (
          <Image
            className="media-poster"
            src={fullyLoadedMedia.posterUrl}
            alt=""
            loaded={poster.loaded}
          />
        )}
        {!fullyLoadedMedia.posterUrl && <svg viewBox="0 0 2 3" />}

        <HeadContainer>
          <MediaTag media={fullyLoadedMedia} />
          {isOnServers(fullyLoadedMedia) && (
            <SuccessIconTag>
              <Icon icon={faCheck} />
            </SuccessIconTag>
          )}
        </HeadContainer>

        <div className="media-hover-info">
          <p>{fullyLoadedMedia.title}</p>
          {fullyLoadedMedia.releaseDate && (
            <p>{new Date(fullyLoadedMedia.releaseDate).getFullYear()}</p>
          )}
          {((isMovie(fullyLoadedMedia) && !isOnServers(fullyLoadedMedia)) ||
            isSeries(fullyLoadedMedia)) && (
            <RequestButton media={fullyLoadedMedia} />
          )}
          {isOnServers(fullyLoadedMedia) &&
            (isMovie(fullyLoadedMedia) || isEpisode(fullyLoadedMedia)) &&
            fullyLoadedMedia.mediaServersInfo &&
            fullyLoadedMedia.mediaServersInfo.length > 0 &&
            fullyLoadedMedia.mediaServersInfo[0].webUrl && (
              <PlayButton
                webUrl={fullyLoadedMedia.mediaServersInfo[0].webUrl}
              />
            )}
        </div>
      </Container>
    </>
  );
};
