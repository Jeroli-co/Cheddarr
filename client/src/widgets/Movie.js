import React, {useState} from "react";
import styled from "styled-components";
import {MovieCardModal} from "./MovieCardModal";

const MovieStyle = styled.div`

  position: relative;
  height: 350px;
  width: 250px;
  transition: .3s ease;

  &:hover {
    border: 2px solid ${(props) => props.theme.primary};
    margin-left: .5em;
    margin-right: .5em;
  }

  .movie-image {
    display: block;
    width: 100%;
    height: 100%;
    opacity: 1;
    transition: opacity .6s ease;
  }

  &:hover .movie-image {
    opacity: 0.3;
  }

  .movie-title {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    opacity: 0;
    transition: opacity .6s ease;
  }

  &:hover .movie-title {
    opacity: 1;
  }

`;

const Movie = ({ movie }) => {

  const [isMovieCardModalActive, setIsMovieCardModalActive] = useState(false);
  return (
    <div className="Movie">
      <MovieStyle movie={movie} onClick={() => setIsMovieCardModalActive(true)}>
        <img className="movie-image" src={movie.poster} alt="Movie poster"/>
        <p className="movie-title">{movie.title}</p>

      </MovieStyle>
        { isMovieCardModalActive && <MovieCardModal movie={movie} onClose={() => setIsMovieCardModalActive(false)}/> }
    </div>
  );
};

export {
  Movie
}
