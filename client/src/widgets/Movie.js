import React, {useState} from "react";
import styled from "styled-components";
import {MovieCardModal} from "./MovieCardModal";

const MovieStyle = styled.div`

  position: relative;
  height: 345px;
  width: 240px;
  transition: .3s ease;
  border: 5px solid transparent;
  
  &:hover {
    border: 2px solid ${(props) => props.theme.primary};
    margin-left: .5em;
    margin-right: .5em;
    
    .movie-title {
      visibility: visible;  
    }
  }
  
  .movie-image {
    display: block;
    width: 100%;
    height: 100%;
    opacity: 1;
    transition: opacity .6s ease;
  }

  .movie-title {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    position: absolute;
    width: 100%; height: 100%;
    top: 0; left: 0;
    transition: opacity .6s ease;
    visibility: hidden;
    color: white;
  }

  &:hover .movie-title {
    background: rgba(0,0,0,0.5);
  }

`;

const Movie = ({ movie }) => {

  const [isMovieCardModalActive, setIsMovieCardModalActive] = useState(false);
  return (
    <div className="Movie">
      <MovieStyle movie={movie} onClick={() => setIsMovieCardModalActive(true)}>
        <img className="movie-image" src={movie.posterUrl} alt="Movie poster"/>
        <p className="movie-title">{movie.title}</p>

      </MovieStyle>
        { isMovieCardModalActive && <MovieCardModal movie={movie} onClose={() => setIsMovieCardModalActive(false)}/> }
    </div>
  );
};

export {
  Movie
}
