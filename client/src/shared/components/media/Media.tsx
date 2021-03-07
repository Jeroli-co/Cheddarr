import React, { useState } from "react";
import styled from "styled-components";
import { IMedia } from "../../models/IMedia";
import { H1, H2, H3 } from "../Titles";
import { minToHoursMinutes } from "../../../utils/media-utils";
import { Row } from "../layout/Row";
import { MediaRating } from "./MediaRating";
import { MediaTag, Tag } from "../Tag";
import { MediaPersonCarousel } from "./MediaPersonCarousel";
import { useRecommendedMedia } from "../../hooks/useRecommendedMedia";
import { Spinner } from "../Spinner";
import { Carousel } from "../layout/Carousel";
import { MediaPreviewCardGrid } from "./MediaPreviewCardGrid";
import { useSimilarMedia } from "../../hooks/useSimilarMedia";
import { PrimaryButton } from "../Button";
import { SeriesRequestOptionsContextProvider } from "../../contexts/SeriesRequestOptionsContext";
import { RequestMediaModal } from "./RequestMediaModal";
import { STATIC_STYLES } from "../../enums/StaticStyles";
import { PrimaryDivider } from "../Divider";

export const Container = styled.div``;

const MediaHeader = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  z-index: 0;
  padding: 20px;
  margin-bottom: 20px;

  .media-poster {
    width: 20%;
    border-radius: 12px;
  }

  @media screen and (max-width: ${STATIC_STYLES.MOBILE_MAX_WIDTH}px) {
    flex-direction: column;
    align-items: center;
    .media-poster {
      width: 80%;
      border-radius: 12px;
    }
  }
`;

const MediaHeaderInfo = styled.div`
  width: 100%;
  padding: 5px 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const MediaHeaderTags = styled.div`
  display: flex;
  flex-wrap: wrap;

  @media screen and (max-width: ${STATIC_STYLES.MOBILE_MAX_WIDTH}px) {
    justify-content: center;
  }
`;

const MediaHeaderSubInfo = styled.div`
  width: 100%;
  display: flex;

  .pipe-separator {
    margin: 0 20px;
  }

  @media screen and (max-width: ${STATIC_STYLES.MOBILE_MAX_WIDTH}px) {
    justify-content: center;
    flex-direction: column;
    margin-bottom: 20px;
    .pipe-separator {
      display: none;
    }
  }
`;

const MediaHeaderActions = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  @media screen and (max-width: ${STATIC_STYLES.MOBILE_MAX_WIDTH}px) {
    width: 100%;
    margin-top: 20px;
  }
`;

const MediaHeaderTitle = styled(H1)`
  font-weight: bold;
  @media screen and (max-width: ${STATIC_STYLES.MOBILE_MAX_WIDTH}px) {
    font-size: 20px;
  }

  .media-title-release-date {
    font-size: 16px;
    @media screen and (max-width: ${STATIC_STYLES.MOBILE_MAX_WIDTH}px) {
      display: none;
    }
  }
`;

const Background = styled.div<{ image: string }>`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  background-image: url('${(props) => props.image}');
  background-repeat: no-repeat;
  background-position: 0 0;
  background-size: cover;
  opacity: 0.2;
  z-index: -1;
`;

const MediaCrewInfo = styled.div`
  display: flex;
  flex-wrap: wrap;

  @media screen and (min-width: ${STATIC_STYLES.MOBILE_MAX_WIDTH}px) {
    justify-content: space-between;
  }
`;

const Bubble = styled.div`
  margin-top: 40px;
  @media screen and (max-width: ${STATIC_STYLES.MOBILE_MAX_WIDTH}px) {
    width: 50%;
  }
`;

type MediaProps = {
  media: IMedia;
};

export const Media = (props: MediaProps) => {
  const recommended = useRecommendedMedia(props.media);
  const similar = useSimilarMedia(props.media);
  const [isRequestMediaModalOpen, setIsRequestMediaModalOpen] = useState(false);

  return (
    <>
      <MediaHeader>
        {props.media.artUrl && <Background image={props.media.artUrl} />}
        {props.media.posterUrl && (
          <img
            className="media-poster"
            src={props.media.posterUrl}
            alt="poster"
          />
        )}
        <MediaHeaderInfo>
          <MediaHeaderTags>
            <MediaTag media={props.media} />
            {props.media.status && <Tag>{props.media.status}</Tag>}
            {props.media.mediaServerInfo && <Tag>Available</Tag>}
          </MediaHeaderTags>
          <MediaHeaderTitle>
            {props.media.title + " "}
            {props.media.releaseDate && (
              <span className="media-title-release-date">
                ({props.media.releaseDate})
              </span>
            )}
          </MediaHeaderTitle>
          <MediaHeaderSubInfo>
            {props.media.releaseDate && (
              <>
                <p>{props.media.releaseDate}</p>
                <p className="pipe-separator">|</p>
              </>
            )}
            {props.media.duration && (
              <>
                <p>{minToHoursMinutes(props.media.duration)}</p>
                <p className="pipe-separator">|</p>
              </>
            )}
            <p>
              {props.media.genres &&
                props.media.genres.map((genre, index) => (
                  <span key={index}>
                    {genre}
                    {props.media.genres && index !== props.media.genres.length
                      ? ", "
                      : ""}
                  </span>
                ))}
            </p>
          </MediaHeaderSubInfo>
          <MediaRating media={props.media} />
        </MediaHeaderInfo>
        <MediaHeaderActions>
          {props.media.mediaServerInfo ? (
            <PrimaryButton type="button">Play</PrimaryButton>
          ) : (
            <PrimaryButton
              type="button"
              width="100%"
              onClick={() => setIsRequestMediaModalOpen(true)}
            >
              Request
            </PrimaryButton>
          )}
        </MediaHeaderActions>
      </MediaHeader>
      {props.media.summary && (
        <>
          <H2>Overview</H2>
          <p>{props.media.summary}</p>
        </>
      )}
      <MediaCrewInfo>
        {props.media.studios && props.media.studios.length > 0 && (
          <Bubble>
            <H2>Studio</H2>
            <p>{props.media.studios[0].name}</p>
          </Bubble>
        )}
        {props.media.credits && props.media.credits.crew && (
          <>
            <Bubble>
              <H2>Directors</H2>
              {props.media.credits.crew.map(
                (p, index) =>
                  p.role && p.role === "Director" && <p key={index}>{p.name}</p>
              )}
            </Bubble>
            <Bubble>
              <H2>Producers</H2>
              {props.media.credits.crew.map(
                (p, index) =>
                  p.role && p.role === "Producer" && <p key={index}>{p.name}</p>
              )}
            </Bubble>
            <Bubble>
              <H2>Screenplay</H2>
              {props.media.credits.crew.map(
                (p, index) =>
                  p.role &&
                  p.role === "Screenplay" && <p key={index}>{p.name}</p>
              )}
            </Bubble>
          </>
        )}
      </MediaCrewInfo>
      {props.media.credits && props.media.credits.cast && (
        <>
          <PrimaryDivider />
          <H2>Actors</H2>
          <MediaPersonCarousel personList={props.media.credits.cast} />
        </>
      )}
      <H2>Recommended</H2>
      {recommended.isLoading && <Spinner />}
      {!recommended.isLoading && recommended.data && (
        <Carousel>
          {recommended.data &&
            recommended.data?.results &&
            recommended.data?.results.map(
              (m, index) =>
                m.posterUrl && <MediaPreviewCardGrid key={index} media={m} />
            )}
        </Carousel>
      )}
      <H2>Similar</H2>

      {similar.isLoading && <Spinner />}
      {!similar.isLoading && similar.data && (
        <Carousel>
          {similar.data &&
            similar.data?.results &&
            similar.data?.results.map(
              (m, index) =>
                m.posterUrl && <MediaPreviewCardGrid key={index} media={m} />
            )}
        </Carousel>
      )}
      {isRequestMediaModalOpen && (
        <SeriesRequestOptionsContextProvider>
          <RequestMediaModal
            media={props.media}
            closeModal={() => setIsRequestMediaModalOpen(false)}
          />
        </SeriesRequestOptionsContextProvider>
      )}
    </>
  );
};
