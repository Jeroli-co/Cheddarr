import React from "react";
import styled from "styled-components";
import {faExternalLinkAlt} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const ModalCardStyled = styled.div`
  width: 1200px;
  height: 800px;
`;

const MoviePoster = styled.div`
  
  height: 100%;
  position: relative;
  cursor: pointer;
  
  &:hover .overlay {
    visibility: visible;
  }
  
  .movie-image {
    width: 100%;
    height: 100%;
  }
  
  .overlay {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.6);
    visibility: hidden;
  }
`;

  


const MovieCardModal = ({ movie, onClose}) => {
  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={onClose} />
      <ModalCardStyled className="modal-card">
      <header className="modal-card-head">
          <p className="modal-card-title has-text-primary has-text-weight-bold has-text-centered">{movie.title}</p>
          <button className="delete" aria-label="close" onClick={onClose}/>
      </header>
        <section className="modal-card-body">
          <div className="columns">
            <div className="column is-one-third">
              <MoviePoster posterUrl={movie.poster} onClick={() => window.open(movie.webUrl)}>
                <img className="movie-image" src={movie.poster} alt="poster"/>
                <div className="overlay">
                  <span className="icon">
                    <FontAwesomeIcon icon={faExternalLinkAlt} size="3x" color="white"/>
                  </span>
                </div>
              </MoviePoster>
            </div>
            <div className="column is-two-thirds">
              <div className="content">
                {movie.summary}
              </div>
            </div>
          </div>
          <div>
            {movie.duration}
          </div>
          <div>
            {movie.rating}
          </div>


        </section>
        <footer className="modal-card-foot">
        </footer>
      </ModalCardStyled>
    </div>
  );
}

export {
  MovieCardModal
}
