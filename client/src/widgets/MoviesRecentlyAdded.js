import React, { useEffect, useState } from "react";
import { usePlex } from "../hooks/usePlex";
import { Carousel } from "../elements/Carousel";
import { Spinner } from "../elements/Spinner";
import styled from "styled-components";
import { MediaStyle } from "./MediaCardStyle";
import { MovieCardModal } from "./MovieCardModal";

const Movie = ({ movie }) => {
  const [isMovieCardModalActive, setIsMovieCardModalActive] = useState(false);
  return (
    <div className="Movie">
      <MediaStyle onClick={() => setIsMovieCardModalActive(true)}>
        <img className="movie-image" src={movie.posterUrl} alt="Movie poster" />
        <p className="movie-title">{movie.title}</p>
      </MediaStyle>
      {isMovieCardModalActive && (
        <MovieCardModal
          movie={movie}
          onClose={() => setIsMovieCardModalActive(false)}
        />
      )}
    </div>
  );
};

const MoviesRecentlyAddedStyled = styled.section`
  margin: 1em;
  display: block;
`;

const MoviesRecentlyAdded = () => {
  const { getMoviesRecentlyAdded } = usePlex();
  const [movies, setMovies] = useState(null);

  useEffect(() => {
    getMoviesRecentlyAdded().then((data) => {
      if (data) setMovies(data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MoviesRecentlyAddedStyled data-testid="MoviesRecentlyAdded">
      <div className="level">
        <div className="level-left">
          <div className="level-item content">
            <p className="is-size-4 has-text-primary has-text-weight-semibold">
              Movies recently added
            </p>
          </div>
        </div>
      </div>

      <div className="is-divider is-primary" />

      {movies && (
        <Carousel>
          {movies.map((movie) => (
            <Movie key={movie.title} movie={movie} />
          ))}
        </Carousel>
      )}

      {!movies && (
        <div className="content has-text-centered has-text-primary">
          <Spinner />
        </div>
      )}
    </MoviesRecentlyAddedStyled>
  );
};

export { MoviesRecentlyAdded };
