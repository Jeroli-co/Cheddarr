import React from "react";
import styled from "styled-components";
import logo from "../assets/plex.png"
import {CircularProgressbar, buildStyles} from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';
import {routes} from "../router/routes";

const ModalCardStyled = styled.div`
  width: 1200px;
  height: 650px;
`;

const MoviePoster = styled.div`
  
  height: 100%;
  position: relative;

  &:hover .overlay {
    visibility: visible;
  }
  
  .movie-image {
    width: 100%;
    height: 100%;
    border-radius: 12px;
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
    border-radius: 12px;
  }
`;

const MovieDetails = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  border: 5px solid red;
`;


const MovieCardModal = ({ movie, onClose}) => {
  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={onClose} />
      <ModalCardStyled className="modal-card">

          <section className="modal-card-body">
            <div className="columns">
              <div className="column is-one-third">
                <MoviePoster>
                  <img className="movie-image" src={movie.posterUrl} alt="poster"/>
                  <div className="overlay">
                    <button className="button has-background-dark-plex is-size-4" type="button" onClick={() => window.open(movie.webUrl)}>
                      <span className="icon">
                        <img className="icon-left" src={logo} alt="Plex logo" width="30px" height="30px"/>
                      </span>
                      <span>Open in Plex</span>
                    </button>
                  </div>
                </MoviePoster>
              </div>
              <div className="column is-two-thirds">
                <MovieDetails className="columns">
                  <div className="column">{movie.releaseDate}</div>
                  <div className="column">{msToHoursMinutes(movie.duration)}</div>
                  <CircularProgressbar className="column" value={movie.rating * 10} text={`${movie.rating * 10}%`} styles={buildStyles({textColor: "black", pathColor: "gold"})}/>
              </MovieDetails>
                <div className="card-content">
                  {movie.summary}
                </div>
              </div>
            </div>



          </section>
      </ModalCardStyled>
    </div>
  );
}

const msToHoursMinutes = (ms) => {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.ceil((ms - (hours * 3600000)) / 60000);

  return hours + 'h ' + minutes + 'm';
}

export {
  MovieCardModal
}
