import React, { useEffect, useState } from "react";
import { usePlex } from "../../../hooks/usePlex";
import { ColumnLayout, RowLayout } from "../../../elements/layouts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faSpinner } from "@fortawesome/free-solid-svg-icons";
import {
  getColorRating,
  getRatingPercentage,
  msToHoursMinutes,
} from "../../../utils/media-utils";
import { Tag, TagColor } from "../../../elements/Tag";
import logo from "../../../assets/plex.png";
import { Spinner } from "../../../elements/Spinner";
import styled from "styled-components";
import { Actors } from "./Actors";

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

const MediaExtendedCard = ({ media }) => {
  const { getMovie } = usePlex();
  const [movieDetails, setMovieDetails] = useState(null);

  useEffect(() => {
    if (media.type === "movie") {
      getMovie(media.id).then((m) => {
        if (m) setMovieDetails(m);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [media]);

  return (
    <RowLayout alignItems="flex-start" childMargin="1%">
      <MediaDetailsPoster src={media.thumbUrl} alt={media.title} />
      <ColumnLayout justifyContent="space-around" width="70%" height="100%">
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
          <RowLayout alignItems="flex-start" childMarginRight="10%">
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
                {media.type === "movie" &&
                  (!movieDetails || movieDetails.id !== media.id) && (
                    <Spinner />
                  )}
                {movieDetails &&
                  movieDetails.id === media.id &&
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

        {media.type === "movie" && (
          <ColumnLayout>
            <RowLayout childMarginTop="1%">
              <p className="is-size-6">
                Actors{" "}
                {(!movieDetails || movieDetails.id !== media.id) && (
                  <FontAwesomeIcon icon={faSpinner} pulse />
                )}
              </p>
            </RowLayout>
            {movieDetails && movieDetails.id === media.id && (
              <Actors actors={movieDetails.actors} />
            )}
          </ColumnLayout>
        )}
      </ColumnLayout>
    </RowLayout>
  );
};

export { MediaExtendedCard };
