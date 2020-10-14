import React, { useContext } from "react";
import { MEDIA_TYPES } from "../../../../media/enums/MediaTypes";
import { RequestReceived } from "./RequestReceived";
import styled, { css } from "styled-components";
import { SCREEN_SIZE } from "../../../../../utils/enums/ScreenSizes";
import { RequestReceivedContext } from "../../../contexts/RequestReceivedContext";

const RequestReceivedContainer = styled.div`
  display: flex;
  width: 100%;
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
      height: auto;

      @media (max-width: ${SCREEN_SIZE.MOBILE_LARGE}px) {
        height: 100%;
      }
    }

    @media (max-width: ${SCREEN_SIZE.TABLET_LARGE}px) {
      flex-basis: 50%;
    }

    @media (max-width: ${SCREEN_SIZE.MOBILE_LARGE}px) {
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

  @media (max-width: ${SCREEN_SIZE.MOBILE_LARGE}px) {
    flex-wrap: wrap;
  }
`;

const MediaRequestReceived = () => {
  const { media, request } = useContext(RequestReceivedContext);

  return (
    <RequestReceivedContainer
      art_url={media.art_url}
      media_type={media.media_type}
    >
      <div className="media-image-container">
        <img src={media.thumbUrl} alt="Movie" />
      </div>
      <div className="media-request-container">
        <div className="media-title">
          <a href={media.link} target="_blank">
            {media.title}
          </a>
          {media.media_type === MEDIA_TYPES.SERIES && (
            <p>{request.children.length} Requests</p>
          )}
        </div>
        <RequestReceived />
      </div>
    </RequestReceivedContainer>
  );
};

export { MediaRequestReceived };
