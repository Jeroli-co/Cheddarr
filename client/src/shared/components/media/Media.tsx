import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { IMedia, isMovie, isOnServers, isSeries } from "../../models/IMedia";
import { H1, H2 } from "../Titles";
import { minToHoursMinutes } from "../../../utils/media-utils";
import { MediaRating } from "./MediaRating";
import { MediaTag, SuccessTag, Tag } from "../Tag";
import { MediaPersonCarousel } from "./MediaPersonCarousel";
import { PlayButton, PrimaryButton, PrimaryLinkButton } from "../Button";
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
import { useImage } from "../../hooks/useImage";
import { Image } from "../Image";

const BackgroundContainer = styled.div`
  position: relative;
  z-index: 0;
`;

const Background = styled.div<{ image: string }>`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  background-image: linear-gradient(
          to bottom,
          rgba(0, 0, 0, 0),
          ${(props) => props.theme.primary}
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
  padding: 20px;
  margin-bottom: 20px;

  span:first-child {
    flex: 1 1 0;
    @media screen and (max-width: ${STATIC_STYLES.MOBILE_MAX_WIDTH}px) {
      width: 75%;
    }
  }

  span:nth-child(2) {
    flex: 4 1 0;
  }

  @media screen and (max-width: ${STATIC_STYLES.MOBILE_MAX_WIDTH}px) {
    flex-direction: column;
    align-items: center;
  }
`;

const MediaHeaderInfo = styled.div`
  flex-grow: 3;
  padding: 5px 20px;

  @media screen and (max-width: ${STATIC_STYLES.MOBILE_MAX_WIDTH}px) {
    justify-content: center;
    text-align: center;
  }
`;

const MediaHeaderTags = styled.div`
  display: flex;
  flex-wrap: wrap;

  @media screen and (max-width: ${STATIC_STYLES.MOBILE_MAX_WIDTH}px) {
    justify-content: center;
  }
`;

const MediaHeaderSubInfo = styled.div`
  display: flex;
  align-items: center;
  white-space: nowrap;

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
  const poster = useImage(props.media.posterUrl);

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
          <span>
            <Image
              src={props.media.posterUrl}
              loaded={poster.loaded}
              alt="poster"
              borderRadius="12px"
            />
          </span>
          <span>
            <MediaHeaderInfo>
              <MediaHeaderTags>
                <MediaTag media={props.media} />
                {props.media.status && <Tag>{props.media.status}</Tag>}
                {props.media.mediaServersInfo && (
                  <SuccessTag>Available</SuccessTag>
                )}
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
                        {props.media.genres &&
                        index !== props.media.genres.length - 1
                          ? ", "
                          : ""}
                      </span>
                    ))}
                </p>
              </MediaHeaderSubInfo>
              <br />
              <Row alignItems="center" wrap="nowrap">
                <Row alignItems="center" wrap="nowrap">
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
                <Row
                  justifyContent="flex-end"
                  alignItems="center"
                  wrap="nowrap"
                >
                  <Buttons>
                    {((isMovie(props.media) && !isOnServers(props.media)) ||
                      isSeries(props.media)) && (
                      <PrimaryButton
                        type="button"
                        onClick={() => setIsRequestMediaModalOpen(true)}
                      >
                        Request
                      </PrimaryButton>
                    )}
                    {props.media.mediaServersInfo &&
                      props.media.mediaServersInfo.length > 0 &&
                      props.media.mediaServersInfo[0].webUrl && (
                        <PlayButton
                          webUrl={props.media.mediaServersInfo[0].webUrl}
                        />
                      )}
                  </Buttons>
                </Row>
              </Row>
            </MediaHeaderInfo>
          </span>
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
