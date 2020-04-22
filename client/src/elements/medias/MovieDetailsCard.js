import React from "react";
import styled from "styled-components";
import logo from "../../assets/plex.png";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const MovieDetailsCardStyle = styled.div`
  position: relative;
  width: 80%;
  padding: 20px;
`;

const MovieDetailsCardBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;

  width: 100%;
  height: 100%;

  background-color: white;
  border-radius: 12px;
  z-index: -2;
`;

const MovieDetailsCardBackgroundImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;

  width: 100%;
  height: 100%;

  background-image: url('${(props) => props.backgroundImage}');
  background-repeat: no-repeat
  background-position: center;
  background-size: cover;
  border-radius: 12px;
  opacity: .6;
  z-index: -1;
`;

const MovieDetailsCardContent = styled.div`
  display: flex;
  color: ${(props) => props.theme.dark};
`;

const MoviePoster = styled.div`
  position: relative;

  img {
    width: 100%;
    height: 100%;
    border-radius: 12px;
  }

  .overlay {

    visibility: hidden;

    position: absolute;
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;

    background: rgba(0, 0, 0, 0.6);
    border-radius: 12px;
  }

  &:hover .overlay {
    visibility: visible;
  }
`;

const MovieDetails = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  font-weight: 600;
`;

const MovieDetailsHead = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 10vh;

  > * {
    margin-right: 20px;
  }

  > .circular-progress {
    width: 60px;
  }
`;

const MovieDetailsBody = styled.div`
  margin: 20px;
  font-size: 1.2em;
`;

const getColorRating = (rating) => "hsl(" + rating + ", 100%, 50%)";
const getRatingPercentage = (rating) => rating * 10;

const MovieDetailsCard = ({ movie }) => {
  return (
    <MovieDetailsCardStyle>

      <MovieDetailsCardBackground/>
      <MovieDetailsCardBackgroundImage backgroundImage={movie.artUrl}/>

      <MovieDetailsCardContent>

        <MoviePoster>
          <img src={movie.posterUrl} alt="poster" />
          <div className="overlay">
            <button
              className="button is-plex-button is-size-4"
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

        <MovieDetails>
          <MovieDetailsHead>
            <div className="circular-progress">
              <CircularProgressbar
                value={getRatingPercentage(movie.rating)}
                text={`${getRatingPercentage(movie.rating)}%`}
                styles={buildStyles({
                  textColor: "black",
                  pathColor: getColorRating(getRatingPercentage(movie.rating)),
                })}
              />
            </div>
            <div>{movie.releaseDate}</div>
            <div>{msToHoursMinutes(movie.duration)}</div>
          </MovieDetailsHead>

          <MovieDetailsBody>
            <p>{movie.summary}</p>
          </MovieDetailsBody>

        </MovieDetails>

      </MovieDetailsCardContent>

    </MovieDetailsCardStyle>
  );
};

const msToHoursMinutes = (ms) => {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.ceil((ms - hours * 3600000) / 60000);
  return hours + "h " + minutes + "m";
};

export { MovieDetailsCard };
