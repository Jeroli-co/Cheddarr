import React from "react";
import styled from "styled-components";

const MovieStyle = styled.div`

  position: relative;

  .movie-image {
    opacity: 1;
    display: block;
    width: 100%;
    height: auto;
    transition: .5s ease;
    backface-visibility: hidden;
  }

  &:hover .movie-image {
    opacity: 0.3;
  }

  .movie-title {
    transition: .5s ease;
    opacity: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
  }

  &:hover .movie-title {
    opacity: 1;
  }

`;

const Movie = ({ movie }) => {
  return (
    <MovieStyle movie={movie}>
      <img className="movie-image" src={movie.poster} alt="Movie poster"/>
      <p className="movie-title">{movie.title}</p>
    </MovieStyle>
  );
};

export {
  Movie
}
