import React from "react";
import styled from "styled-components";
import logo from "../assets/plex.png";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

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
    background: rgba(0, 0, 0, 0.6);
    visibility: hidden;
    border-radius: 12px;
  }
`;

const MovieDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 10vh;

  > .circular-progress {
    width: 10%;
  }
`;

const ratingColor = {
  GREEN: "#3fab2e",
  YELLOW: "#dedb37",
  ORANGE: "#e3a034",
  RED: "#c43b2b"
}

const getColorRating = (rating) => {
  if (rating >= 0 && rating < 25) {
    return ratingColor.RED;
  } else if (rating >= 25 && rating < 50) {
    return ratingColor.ORANGE;
  } else if (rating >= 50 && rating < 75) {
    return ratingColor.YELLOW;
  } else {
    return ratingColor.GREEN;
  }
};

const getRatingPercentage = (rating) => rating * 10;

const MovieCardModal = ({ movie, onClose }) => {
  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={onClose} />
      <ModalCardStyled className="modal-card">
        <section className="modal-card-body">
          <div className="columns">
            <div className="column is-one-third">
              <MoviePoster>
                <img
                  className="movie-image"
                  src={movie.posterUrl}
                  alt="poster"
                />
                <div className="overlay">
                  <button
                    className="button has-background-dark-plex is-size-4"
                    type="button"
                    onClick={() => window.open(movie.webUrl)}
                  >
                    <span className="icon">
                      <img
                        className="icon-left"
                        src={logo}
                        alt="Plex logo"
                        width="30px"
                        height="30px"
                      />
                    </span>
                    <span>Open in Plex</span>
                  </button>
                </div>
              </MoviePoster>
            </div>
            <div className="column is-two-thirds">
              <MovieDetails>
                <div>{movie.releaseDate}</div>
                <div>{msToHoursMinutes(movie.duration)}</div>
                <div className="circular-progress">
                  <CircularProgressbar
                    value={getRatingPercentage(movie.rating)}
                    text={`${getRatingPercentage(movie.rating)}%`}
                    styles={buildStyles({
                      textColor: "black",
                      pathColor: getColorRating(getRatingPercentage(movie.rating)),
                    })}
                    style={{
                      width: "200px",
                      height: "200px"
                    }}
                  />
                </div>
              </MovieDetails>
              <div className="card-content">{movie.summary}</div>
            </div>
          </div>
        </section>
      </ModalCardStyled>
    </div>
  );
};

const msToHoursMinutes = (ms) => {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.ceil((ms - hours * 3600000) / 60000);

  return hours + "h " + minutes + "m";
};

export { MovieCardModal };
