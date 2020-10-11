import React, { useEffect, useState } from "react";
import { MEDIA_TYPES } from "../../../../media/enums/MediaTypes";
import { useMedia } from "../../../../media/hooks/useMedia";
import { Spinner } from "../../../../../utils/elements/Spinner";
import { Container } from "../../../../../utils/elements/Container";
import { RequestReceived } from "./RequestReceived";
import styled, { css } from "styled-components";
import { SCREEN_SIZE } from "../../../../../utils/enums/ScreenSizes";
import { RequestsPagination } from "./RequestsPagination";

const RequestReceivedContainer = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  justify-content: space-between;
  border-bottom: 1px solid ${(props) => props.theme.dark};
  border-right: 1px solid ${(props) => props.theme.dark};
  border-left: 1px solid ${(props) => props.theme.dark};
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  margin-bottom: 20px;

  & .media-image-container {
    flex-basis: 30%;

    & > img {
      width: 100%;
      height: 100%;
    }

    @media (max-width: ${SCREEN_SIZE.TABLET_SMALL}px) {
      flex-basis: 100%;
    }
  }

  & .media-request-container {
    flex-grow: 1;
    max-width: calc(70% - 20px);
    display: flex;
    flex-direction: column;
    padding-left: 20px;

    & .media-title {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      & > a {
        font-size: 1.5em;
      }

      & > p {
        font-size: 1em;
      }
    }

    @media (max-width: ${SCREEN_SIZE.MOBILE_LARGE}px) {
      position: relative;
      max-width: 100%;
      padding: 20px;
      ::after {
        content: "";
        background: url('${(props) => props.art_url}') no-repeat;
        background-size: 100% 100%;
        opacity: 0.2;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        position: absolute;
        z-index: -1;
        border-bottom: 1px solid ${(props) => props.theme.dark};
        border-right: 1px solid ${(props) => props.theme.dark};
        border-left: 1px solid ${(props) => props.theme.dark};
        border-bottom-left-radius: 12px;
        border-bottom-right-radius: 12px;
      }
    }
  }

  @media (min-width: ${SCREEN_SIZE.MOBILE_LARGE}px) {
    padding: 20px;
    border: 1px solid ${(props) => props.theme.dark};
    border-radius: 12px;
    position: relative;
    ::after {
      content: "";
      background: url('${(props) => props.art_url}') no-repeat;
      background-size: 100% 100%;
      border-radius: 12px;
      opacity: 0.2;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      position: absolute;
      z-index: -1;
    }
  }

  @media (min-width: ${SCREEN_SIZE.TABLET_MEDIUM}px) {
    margin-left: 5px;
    margin-right: 5px;
    flex-wrap: nowrap;

    ${(props) =>
      props.media_type === MEDIA_TYPES.MOVIE &&
      css`
        width: calc(50% - 10px);
      `}
  }

  @media (min-width: ${SCREEN_SIZE.DESKTOP_MEDIUM}px) {
    ${(props) =>
      props.media_type === MEDIA_TYPES.SERIES &&
      css`
        margin-left: 15%;
        margin-right: 15%;
      `}
  }
`;

const MediaRequestReceived = ({ media_type, request, providers }) => {
  const media = useMedia(media_type, request.tmdb_id || request.tvdb_id);
  const [childRequestSelected, setChildRequestSelected] = useState(null);
  const isSeries = media_type === MEDIA_TYPES.SERIES;
  const childrenCount = isSeries ? request.children.length : -1;

  useEffect(() => {
    setChildRequestSelected(
      isSeries
        ? { index: 0, data: request.children[0] }
        : { index: -1, data: request }
    );
  }, [media]);

  const onPrevRequest = () => {
    let prevIndex = childRequestSelected.index;
    if (childRequestSelected.index === 0) {
      prevIndex = request.children.length - 1;
    } else {
      prevIndex = prevIndex - 1;
    }
    setChildRequestSelected({
      index: prevIndex,
      data: request.children[prevIndex],
    });
  };

  const onNextRequest = () => {
    let nextIndex = childRequestSelected.index;
    if (childRequestSelected.index === request.children.length - 1) {
      nextIndex = 0;
    } else {
      nextIndex = nextIndex + 1;
    }
    setChildRequestSelected({
      index: nextIndex,
      data: request.children[nextIndex],
    });
  };

  if (!media.isLoaded) {
    return (
      <Container padding="15px">
        <Spinner size="2x" />
      </Container>
    );
  }

  if (media.isLoaded && media.data === null) {
    return <p>An error occurred</p>;
  }

  return (
    <RequestReceivedContainer
      art_url={media.data.art_url}
      media_type={media.data.media_type}
    >
      <div className="media-image-container">
        <img src={media.data.thumbUrl} alt="Movie" />
      </div>
      <div className="media-request-container">
        <div className="media-title">
          <a href={media.data.link} target="_blank">
            {media.data.title}
          </a>
          {isSeries && <p>{request.children.length} Requests</p>}
        </div>
        <RequestReceived
          request={childRequestSelected.data}
          media_id={request.tmdb_id || request.tvdb_id}
          media_type={media_type}
          providers={providers}
        />
        {isSeries && request.children.length > 1 && (
          <RequestsPagination
            currentIndex={childRequestSelected.index}
            requestsCount={childrenCount}
            handlePrevRequest={onPrevRequest}
            handleNextRequest={onNextRequest}
          />
        )}
      </div>
    </RequestReceivedContainer>
  );
};

export { MediaRequestReceived };
