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
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import logo from "../assets/plex.png";
import { Modal } from "./Modal";

const MediaPreviewCardStyle = styled.div`
  position: relative;
  min-width: 10vw;
  max-width: 10vw;
  height: auto;
  transition: 0.3s ease;
  border: 5px solid transparent;
  border-radius: 12px;

  &:hover {
    border: 2px solid ${(props) => props.theme.primary};
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
    border-radius: 12px;
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
    border-radius: 12px;
  }

  &:hover .media-title {
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
  opacity: .4;
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
  width: 100%;
  height: auto;
  border-radius: 12px;
`;

const MediaDetailsRating = styled.div`
  width: 60px;
`;

const Actor = styled.div`
  margin: 1%;
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
      {actors &&
        actors.map((actor) => (
          <Actor key={actor.name}>
            {actor.thumbUrl ? (
              <ActorPicture src={actor.thumbUrl} alt="" />
            ) : (
              <ActorInitials>
                <p>{getActorInitial(actor.name)}</p>
              </ActorInitials>
            )}
            <p className="is-size-7">{actor.name}</p>
          </Actor>
        ))}
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
      <RowLayout alignItems="flex-start">
        <ColumnLayout width="25%">
          <MediaDetailsPoster src={media.thumbUrl} alt={media.title} />
        </ColumnLayout>

        <ColumnLayout justifyContent="space-around" width="75%" height="100%">
          <ColumnLayout>
            {media.type === "movie" && (
              <p className="is-size-2">{media.title}</p>
            )}
            {media.type === "episode" && (
              <p className="is-size-2">
                S{media.seasonNumber}・E{media.episodeNumber} - {media.title}
              </p>
            )}
            <RowLayout wrap="wrap">
              <p className="is-size-7">{media.releaseDate}</p>
              <FontAwesomeIcon icon={faCircle} style={{ fontSize: "5px" }} />
              <p className="is-size-7">{msToHoursMinutes(media.duration)}</p>
              {!media.isWatched && (
                <FontAwesomeIcon icon={faCircle} style={{ fontSize: "5px" }} />
              )}
              {!media.isWatched && <p className="is-size-7">Unplayed</p>}
              {movieDetails && (
                <FontAwesomeIcon icon={faCircle} style={{ fontSize: "5px" }} />
              )}
              {movieDetails &&
                movieDetails.genres.map((genre, index) => (
                  <Tag key={index} type={TagColor.INFO} content={genre.name} />
                ))}
              {media.type === "movie" && !movieDetails && <Spinner />}
            </RowLayout>

            <RowLayout>
              {media.rating && (
                <MediaDetailsRating>
                  <CircularProgressbar
                    value={getRatingPercentage(media.rating)}
                    text={`${getRatingPercentage(media.rating)}%`}
                    background
                    styles={buildStyles({
                      textColor: "GhostWhite",
                      pathColor: getColorRating(
                        getRatingPercentage(media.rating)
                      ),
                      backgroundColor: "#282a2d",
                    })}
                  />
                </MediaDetailsRating>
              )}
              {media.rating && <p>Rating</p>}
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

          <RowLayout>
            <ColumnLayout>
              <div className="is-size-5">Overview</div>
              <div className="is-size-6">{media.summary}</div>
            </ColumnLayout>
          </RowLayout>

          {media.type === "movie" && <br />}
          {media.type === "movie" && (
            <RowLayout alignItems="flex-start">
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
            </RowLayout>
          )}
        </ColumnLayout>
      </RowLayout>

      {media.type === "movie" && (
        <RowLayout>
          <ColumnLayout>
            <p className="is-size-6">
              Actors{" "}
              {!movieDetails && <FontAwesomeIcon icon={faSpinner} pulse />}
            </p>
            {movieDetails && <Actors actors={movieDetails.actors} />}
          </ColumnLayout>
        </RowLayout>
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
