import styled from "styled-components";
import { Carousel } from "./Carousel";
import React, { useEffect, useState } from "react";
import {
  getActorInitial,
  getColorRating,
  getRatingPercentage,
  msToHoursMinutes,
} from "../utils/media-utils";
import { usePlex } from "../hooks/usePlex";
import { ColumnLayout, RowLayout } from "./layouts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { Tag, TagColor } from "./Tag";
import { Spinner } from "./Spinner";
import logo from "../assets/plex.png";
import { Modal } from "./Modal";

const MediaPreviewCardStyle = styled.div`
  position: relative;
  min-width: 10vw;
  max-width: 10vw;
  min-height: 50px;
  transition: 0.3s ease;
  margin-left: 0.2em;
  margin-right: 0.2em;
  border-radius: 1vw;

  @media only screen and (max-width: 1024px) {
    min-width: 30vw;
    max-width: 30vw;
  }

  &:hover {
    margin-left: 0.5em;
    margin-right: 0.5em;

    .media-title {
      visibility: visible;
    }
  }

  .media-image {
    display: block;
    width: 100%;
    height: 100%;
    opacity: 1;
    transition: opacity 0.6s ease;
    border-radius: 1vw;
  }

  .media-title {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    transition: opacity 0.6s ease;
    visibility: hidden;
    color: white;
    border-radius: 1vw;
  }

  &:hover .media-title {
    border: 2px solid ${(props) => props.theme.primary};
    background: rgba(0, 0, 0, 0.5);
  }
`;

const MediaDetailsCardStyle = styled.div`
  position: relative;
  width: 80vw;
  min-height: 60vh;
  font-weight: 600;
  color: ${(props) => props.theme.dark};
`;

const MediaDetailsCardBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: white;
  border-radius: 12px;
  z-index: -2;
`;

const MediaDetailsCardBackgroundImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('${(props) => props.backgroundImage}');
  background-repeat: no-repeat
  background-position: center;
  background-size: cover;
  border-radius: 12px;
  opacity: .2;
  z-index: -1;
`;

const MediaDetailsCard = ({ children, artUrl }) => {
  return (
    <MediaDetailsCardStyle>
      <MediaDetailsCardBackground />
      <MediaDetailsCardBackgroundImage backgroundImage={artUrl} />
      {children}
    </MediaDetailsCardStyle>
  );
};

const MediaDetailsPoster = styled.img`
  width: 25%;
  height: auto;
  border-radius: 12px;
`;

const MediaDetailsRating = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  background-color: ${(props) => props.backgroundColor};
`;

const ActorPicture = styled.img`
  min-width: 120px;
  max-width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  object-position: 50% 50%;
`;

const ActorInitials = styled.div`
  min-width: 120px;
  max-width: 120px;
  height: 120px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.transparentDark};
  color: ${(props) => props.theme.dark};
  font-size: 2em;
`;

const Actors = ({ actors }) => {
  return (
    <Carousel>
      <RowLayout childMarginRight="1%" alignItems="flex-start">
        {actors &&
          actors.map((actor) => (
            <div>
              {actor.thumbUrl ? (
                <ActorPicture src={actor.thumbUrl} alt="" />
              ) : (
                <ActorInitials>
                  <p>{getActorInitial(actor.name)}</p>
                </ActorInitials>
              )}
              <div className="content has-text-centered">
                <p className="is-size-7">{actor.name}</p>
                <p className="is-size-7 has-text-weight-light">{actor.role}</p>
              </div>
            </div>
          ))}
      </RowLayout>
    </Carousel>
  );
};

const MediaCard = ({ media }) => {
  const { getMovie } = usePlex();
  const [movieDetails, setMovieDetails] = useState(null);

  useEffect(() => {
    if (media.type === "movie") {
      getMovie(media.id).then((m) => {
        if (m) setMovieDetails(m);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MediaDetailsCard artUrl={media.artUrl}>
      <RowLayout alignItems="flex-start" childMargin="1%">
        <MediaDetailsPoster src={media.thumbUrl} alt={media.title} />
        <ColumnLayout justifyContent="space-around" height="100%">
          <ColumnLayout>
            {media.type === "movie" && (
              <p className="is-size-2-desktop is-size-4-tablet is-size-6-mobile">
                {media.title}
              </p>
            )}
            {media.type === "episode" && (
              <p className="is-size-2 is-size-4-tablet is-size-6-mobile">
                S{media.seasonNumber}・E{media.episodeNumber} - {media.title}
              </p>
            )}
            <RowLayout wrap="wrap" childMarginRight="1%">
              <p
                className="is-size-7"
                style={{ cursor: "default" }}
                data-tooltip="Released"
              >
                {media.releaseDate}
              </p>
              <FontAwesomeIcon icon={faCircle} style={{ fontSize: "5px" }} />
              <p
                className="is-size-7"
                style={{ cursor: "default" }}
                data-tooltip="Duration"
              >
                {msToHoursMinutes(media.duration)}
              </p>
              <FontAwesomeIcon icon={faCircle} style={{ fontSize: "5px" }} />
              <p
                className="is-size-7"
                style={{ cursor: "default" }}
                data-tooltip="Content rating"
              >
                {media.contentRating}
              </p>
            </RowLayout>

            {!media.isWatched && (
              <RowLayout childMarginTop="1%" childMarginBottom="1%">
                <Tag type={TagColor.DARK} content="Unplayed" />
              </RowLayout>
            )}

            <RowLayout
              childMarginTop="1%"
              childMarginBottom="1%"
              childMarginRight="3%"
              wrap="wrap"
            >
              {media.rating && (
                <MediaDetailsRating
                  data-tooltip="Rating"
                  style={{ cursor: "default" }}
                  backgroundColor={getColorRating(
                    getRatingPercentage(media.rating)
                  )}
                >
                  {getRatingPercentage(media.rating) + "%"}
                </MediaDetailsRating>
              )}
              <button
                className="button is-plex-button"
                type="button"
                onClick={() => window.open(media.webUrl)}
              >
                <span className="icon">
                  <img className="icon-left" src={logo} alt="Plex logo" />
                </span>
                <span>Open in Plex</span>
              </button>
            </RowLayout>
          </ColumnLayout>

          <RowLayout className="is-summary-desktop" childMarginTop="1%">
            <ColumnLayout>
              <div className="is-size-5">Overview</div>
              <div className="is-size-6">{media.summary}</div>
            </ColumnLayout>
          </RowLayout>

          {media.type === "movie" && <br />}
          {media.type === "movie" && (
            <RowLayout alignItems="flex-start" childMarginRight="2%">
              <div>
                <p className="is-size-6">Directed</p>
                {media.directors.map((director, index) => (
                  <p className="is-size-7" key={index}>
                    {director.name +
                      (index + 1 === media.directors.length ? "" : ", ")}
                  </p>
                ))}
              </div>

              <div>
                <p className="is-size-6">Studio</p>
                <p className="is-size-7">{media.studio}</p>
              </div>

              <ColumnLayout>
                <p className="is-size-6">Genres</p>
                <RowLayout childMarginRight="1%" wrap="wrap">
                  {media.type === "movie" && !movieDetails && <Spinner />}
                  {movieDetails &&
                    movieDetails.genres.map((genre, index) => (
                      <Tag
                        key={index}
                        type={TagColor.INFO}
                        content={genre.name}
                      />
                    ))}
                </RowLayout>
              </ColumnLayout>
            </RowLayout>
          )}
        </ColumnLayout>
      </RowLayout>

      {media.type === "movie" && (
        <ColumnLayout>
          <RowLayout childMarginLeft="1%" childMarginBottom="1%">
            <p className="is-size-6">
              Actors{" "}
              {!movieDetails && <FontAwesomeIcon icon={faSpinner} pulse />}
            </p>
          </RowLayout>
          {movieDetails && <Actors actors={movieDetails.actors} />}
        </ColumnLayout>
      )}
    </MediaDetailsCard>
  );
};

const MediaPreview = ({ media }) => {
  const [isMediaCardModalActive, setIsMediaCardModalActive] = useState(false);

  return (
    <div className="Media">
      <MediaPreviewCardStyle onClick={() => setIsMediaCardModalActive(true)}>
        <img
          className="media-image"
          src={
            media.type === "movie"
              ? media.thumbUrl
              : media.type === "episode"
              ? media.seasonThumbUrl
              : ""
          }
          alt={
            media.title.length <= 20
              ? media.title
              : media.title.slice(0, 20) + "..."
          }
        />
        <div className="media-title is-size-5-tablet is-size-7-mobile">
          {media.type === "movie" && media.title}
          {media.type === "episode" && (
            <div>
              <p>{media.seriesTitle}</p>
              <p>
                S{media.seasonNumber} ・ E{media.episodeNumber}
              </p>
            </div>
          )}
        </div>
      </MediaPreviewCardStyle>

      {isMediaCardModalActive && (
        <Modal onClose={() => setIsMediaCardModalActive(false)}>
          <MediaCard media={media} />
        </Modal>
      )}
    </div>
  );
};

export { MediaPreview };
