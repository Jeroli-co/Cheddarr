import React, { useEffect, useState } from "react";
import { usePlex } from "../../../hooks/usePlex";
import { RowLayout } from "../../../elements/layouts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { Tag, TagColor } from "../../../elements/Tag";
import { Spinner } from "../../../elements/Spinner";
import styled from "styled-components";
import { Actors } from "./Actors";
import { MediaExtendedCardHead } from "./MediaExtendedCardHead";

const MediaExtendedCardStyle = styled.div`
  margin: 0;
  padding: 1%;
`;

const MediaDetailsPoster = styled.img`
  width: 20%;
  height: auto;
  border-radius: 12px;
`;

const MediaDetailsInfo = styled.div`
  padding-left: 1%;
  padding-right: 1%;
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
    <MediaExtendedCardStyle>
      <RowLayout alignItems="flex-start">
        <MediaDetailsPoster src={media.thumbUrl} alt={media.title} />
        <MediaDetailsInfo>
          <MediaExtendedCardHead media={media} />

          <RowLayout childMarginTop="1em">
            <div>
              <div className="is-size-5">Overview</div>
              <div className="is-size-6">{media.summary}</div>
            </div>
          </RowLayout>

          {media.type === "movie" && (
            <RowLayout
              alignItems="flex-start"
              marginTop="1em"
              childMarginRight="1%"
            >
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

              <div>
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
              </div>
            </RowLayout>
          )}
        </MediaDetailsInfo>
      </RowLayout>
      {media.type === "movie" &&
        ((movieDetails && movieDetails.id === media.id && (
          <Actors actors={movieDetails.actors} />
        )) || <FontAwesomeIcon icon={faSpinner} pulse />)}
    </MediaExtendedCardStyle>
  );
};

export { MediaExtendedCard };
