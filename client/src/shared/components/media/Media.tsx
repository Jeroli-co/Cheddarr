import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { IMedia, isMovie, isSeries } from "../../models/IMedia";
import { H1, H2 } from "../Titles";
import { minToHoursMinutes } from "../../../utils/media-utils";
import { MediaRating } from "./MediaRating";
import { MediaTag, Tag } from "../Tag";
import { MediaPersonCarousel } from "./MediaPersonCarousel";
import { PrimaryButton, PrimaryLinkButton } from "../Button";
import { SeriesRequestOptionsContextProvider } from "../../contexts/SeriesRequestOptionsContext";
import { RequestMediaModal } from "../requests/RequestMediaModal";
import { STATIC_STYLES } from "../../enums/StaticStyles";
import { PrimaryDivider } from "../Divider";
import { Row } from "../layout/Row";
import { Icon } from "../Icon";
import { faFilm } from "@fortawesome/free-solid-svg-icons";
import { Buttons } from "../layout/Buttons";
import { MediaCarouselWidget } from "./MediaCarouselWidget";
import { APIRoutes } from "../../enums/APIRoutes";

const BackgroundContainer = styled.div`
  position: relative;
  z-index: 0;
`;

const Background = styled.div<{ image: string }>`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-image: linear-gradient(
          to bottom,
          rgba(0, 0, 0, 0),
          ${(props) => props.theme.black}
        ),
        url('${(props) => props.image}');
  background-repeat: no-repeat;
  background-position: 0 0;
  background-size: cover;
  opacity: 0.2;
  z-index: -1;
`;

const MediaHeader = styled.div`
  display: flex;
  width: 100%;
  padding: 20px;
  margin-bottom: 20px;

  .media-poster {
    width: 15%;
    border-radius: 12px;
  }

  @media screen and (max-width: ${STATIC_STYLES.TABLET_MAX_WIDTH}px) {
    .media-poster {
      width: 25%;
    }
  }

  @media screen and (max-width: ${STATIC_STYLES.MOBILE_MAX_WIDTH}px) {
    flex-direction: column;
    align-items: center;
    .media-poster {
      width: 80%;
    }
  }
`;

const MediaHeaderInfo = styled.div`
  width: 100%;
  padding: 5px 20px;
  display: flex;
  flex-direction: column;
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

const MediaCrewInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const Bubble = styled.div`
  margin-top: 40px;
  flex-grow: 1;

  @media screen and (max-width: ${STATIC_STYLES.MOBILE_MAX_WIDTH}px) {
    width: 50%;
  }
`;

type MediaProps = {
  media: IMedia;
  mediaRef?: any;
};

export const Media = (props: MediaProps) => {
  const [studio, setStudio] = useState<string | null>(null);
  const [directors, setDirectors] = useState<string[] | null>(null);
  const [producers, setProducers] = useState<string[] | null>(null);
  const [screenplay, setScreenplay] = useState<string[] | null>(null);
  const [isRequestMediaModalOpen, setIsRequestMediaModalOpen] = useState(false);

  useEffect(() => {
    const directorsTmp: string[] = [];
    const producersTmp: string[] = [];
    const screenplayTmp: string[] = [];
    if (props.media.studios && props.media.studios.length > 0) {
      setStudio(props.media.studios[0].name);
    }
    if (props.media.credits && props.media.credits.crew) {
      props.media.credits.crew.forEach((p) => {
        if (p.role === "Director") {
          directorsTmp.push(p.name);
        } else if (p.role === "Producer") {
          producersTmp.push(p.name);
        } else if (p.role === "Screenplay") {
          screenplayTmp.push(p.name);
        }
      });
    }
    setDirectors(directorsTmp);
    setProducers(producersTmp);
    setScreenplay(screenplayTmp);
  }, [props.media]);

  return (
    <span ref={props.mediaRef}>
      <BackgroundContainer>
        {props.media.artUrl && <Background image={props.media.artUrl} />}
        <MediaHeader>
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
            <br />
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
                  {(props.media.duration || props.media.genres) && (
                    <p className="pipe-separator">|</p>
                  )}
                </>
              )}
              {props.media.duration && (
                <>
                  <p>{minToHoursMinutes(props.media.duration)}</p>
                  {props.media.genres && <p className="pipe-separator">|</p>}
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
            <br />
            <Row alignItems="center">
              <MediaRating media={props.media} />
              {props.media.trailers && props.media.trailers.length > 0 && (
                <Buttons>
                  <PrimaryLinkButton
                    href={props.media.trailers[0].videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="left-icon">
                      <Icon icon={faFilm} />
                    </span>
                    Watch trailer
                  </PrimaryLinkButton>
                </Buttons>
              )}
            </Row>
          </MediaHeaderInfo>
          <MediaHeaderActions>
            {props.media.mediaServerInfo &&
              props.media.mediaServerInfo.length > 0 &&
              props.media.mediaServerInfo[0].webUrl && (
                <PrimaryLinkButton
                  href={props.media.mediaServerInfo[0].webUrl}
                  target="_blank"
                >
                  Play
                </PrimaryLinkButton>
              )}
            {(!props.media.mediaServerInfo || isSeries(props.media)) && (
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
      </BackgroundContainer>
      <MediaCrewInfo>
        {studio && (
          <Bubble>
            <H2>Studio</H2>
            <p>{studio}</p>
          </Bubble>
        )}
        {directors && directors.length > 0 && (
          <Bubble>
            <H2>Directors</H2>
            {directors.map((name, index) => (
              <p key={index}>{name}</p>
            ))}
          </Bubble>
        )}
        {producers && producers.length > 0 && (
          <Bubble>
            <H2>Producers</H2>
            {producers.map((name, index) => (
              <p key={index}>{name}</p>
            ))}
          </Bubble>
        )}

        {screenplay && screenplay.length > 0 && (
          <Bubble>
            <H2>Screenplay</H2>
            {screenplay.map((name, index) => (
              <p key={index}>{name}</p>
            ))}
          </Bubble>
        )}
      </MediaCrewInfo>

      {props.media.credits &&
        props.media.credits.cast &&
        props.media.credits.cast.length > 0 && (
          <>
            <PrimaryDivider />
            <H2>Actors</H2>
            <MediaPersonCarousel personList={props.media.credits.cast} />
          </>
        )}

      <PrimaryDivider />

      {isMovie(props.media) && (
        <MediaCarouselWidget
          title="Recommended"
          url={APIRoutes.GET_RECOMMENDED_MOVIES(props.media.tmdbId)}
        />
      )}
      {isSeries(props.media) && (
        <MediaCarouselWidget
          title="Recommended"
          url={APIRoutes.GET_RECOMMENDED_SERIES(props.media.tmdbId)}
        />
      )}

      <PrimaryDivider />

      {isMovie(props.media) && (
        <MediaCarouselWidget
          title="Similar"
          url={APIRoutes.GET_SIMILAR_MOVIES(props.media.tmdbId)}
        />
      )}
      {isSeries(props.media) && (
        <MediaCarouselWidget
          title="Similar"
          url={APIRoutes.GET_SIMILAR_SERIES(props.media.tmdbId)}
        />
      )}

      {isRequestMediaModalOpen && (
        <SeriesRequestOptionsContextProvider>
          <RequestMediaModal
            media={props.media}
            closeModal={() => setIsRequestMediaModalOpen(false)}
          />
        </SeriesRequestOptionsContextProvider>
      )}
    </span>
  );
};
