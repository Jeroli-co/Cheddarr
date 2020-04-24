import React, { useEffect, useState } from "react";
import { usePlex } from "../hooks/usePlex";
import { Carousel } from "../elements/Carousel";
import { Spinner } from "../elements/Spinner";
import styled from "styled-components";
import { Modal } from "../elements/Modal";
import { MovieDetailsCard } from "../elements/medias/MovieDetailsCard";
import { MediaPreviewCardStyle } from "../elements/medias/MediaPreviewCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleRight } from "@fortawesome/free-solid-svg-icons";

const MoviesRecentlyAddedStyle = styled.section`
  margin: 1em;
`;

const Movie = ({ movie }) => {
  const [isMovieCardModalActive, setIsMovieCardModalActive] = useState(false);

  return (
    <div className="Movie">
      <MediaPreviewCardStyle onClick={() => setIsMovieCardModalActive(true)}>
        <img
          className="media-image"
          src={movie.thumbUrl}
          alt={
            movie.title.length <= 20
              ? movie.title
              : movie.title.slice(0, 20) + "..."
          }
        />
        <p className="media-title is-size-5-tablet is-size-7-mobile">
          {movie.title}
        </p>
      </MediaPreviewCardStyle>

      {isMovieCardModalActive && (
        <Modal onClose={() => setIsMovieCardModalActive(false)}>
          <MovieDetailsCard movie={movie} />
        </Modal>
      )}
    </div>
  );
};

const MoviesRecentlyAdded = () => {
  const { getMoviesRecentlyAdded } = usePlex();
  const [movies, setMovies] = useState(null);
  const [isShow, setIsShow] = useState(true);

  useEffect(() => {
    getMoviesRecentlyAdded().then((data) => {
      if (data) setMovies(data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MoviesRecentlyAddedStyle data-testid="MoviesRecentlyAdded">
      <div className="is-pointed" onClick={() => setIsShow(!isShow)}>
        <div className="level is-mobile">
          <div className="level-left">
            <div className="level-item content">
              <p className="is-size-4 has-text-primary has-text-weight-semibold">
                Movies recently added
              </p>
            </div>
          </div>
          <div className="level-right">
            <div className="level-item">
              <p className="is-size-4 has-text-primary has-text-weight-semibold">
                {(isShow && (
                  <FontAwesomeIcon icon={faAngleDown} size="lg" />
                )) || <FontAwesomeIcon icon={faAngleRight} size="lg" />}
              </p>
            </div>
          </div>
        </div>

        <div className="is-divider is-primary" />
      </div>

      {movies && isShow && (
        <Carousel>
          {movies.map((movie) => (
            <Movie key={movie.title} movie={movie} />
          ))}
        </Carousel>
      )}

      {!movies && <Spinner color="primary" size="2x" justifyContent="center" />}
    </MoviesRecentlyAddedStyle>
  );
};

export { MoviesRecentlyAdded };
