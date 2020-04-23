import React from "react";
import styled, {css} from "styled-components";
import logo from "../../assets/plex.png";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {Tag, TagColor} from "../Tag";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircle} from "@fortawesome/free-solid-svg-icons";

const MovieDetailsCardStyle = styled.div`
  position: relative;
  display: flex;
  width: 80vw;
  max-height: 80vh;
  padding: 1%;
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
  opacity: .4;
  z-index: -1;
`;

const MovieDetailsCardContent = styled.div`
  display: flex;
  width: 100%;
  max-height: 100%;
  font-weight: 600;
  color: ${(props) => props.theme.dark};
  overflow: auto;
  -ms-overflow-style: none; /* IE 11 */
  scrollbar-width: none; /* Firefox 64 */
  ::-webkit-scrollbar {
    display: none;
  }
`;

const MoviePoster = styled.div`
  min-width: 25%;
  max-width: 25%;

  > img {
    width: 100%;
    height: auto;
    border-radius: 12px;
  }
`;

const MainColumnLayout = styled.div`
  display: flex;
  flex-direction: column;
  margin: 2%;
  width: 100%;
`;

const ColumnLayout = styled.div`
  display: flex;
  flex-direction: column;
  width: ${(props) => props.width ? props.width : "100%"};
`;

const RowLayout = styled.div`
  display: flex;
  flex-wrap: ${(props) => props.wrap ? props.wrap : "nowrap"};
  justify-content: ${(props) => props.justifyContent ? props.justifyContent : "flex-start"};
  align-items: center;
  width: ${(props) => props.width ? props.width : "100%"};

  > * {
    margin-right: ${(props) => props.marginRight ? props.marginRight : "0"};
    margin-left: ${(props) => props.marginLeft ? props.marginLeft : "0"};
  }
`;

const Rating = styled.div`
  width: 60px;
`;

const getColorRating = (rating) => "hsl(" + rating + ", 100%, 50%)";
const getRatingPercentage = (rating) => rating * 10;

const MovieDetailsCard = ({ movie }) => {

  console.log(movie);

  return (
    <MovieDetailsCardStyle>

      <MovieDetailsCardBackground/>
      <MovieDetailsCardBackgroundImage backgroundImage={movie.artUrl}/>

      <MovieDetailsCardContent>

        <MoviePoster>
          <img src={movie.posterUrl} alt="poster" />
        </MoviePoster>

        <MainColumnLayout>

          <RowLayout justifyContent="space-between">
            <ColumnLayout>
              <p className="is-size-2">{movie.title}</p>
              <RowLayout marginRight="1%" wrap="wrap">
                { movie.genres.map((genre, index) => <Tag key={index} type={TagColor.INFO} content={genre} />) }
                <FontAwesomeIcon icon={faCircle} style={{fontSize: "5px"}} />
                <p className="is-size-7">{movie.releaseDate}</p>
                <FontAwesomeIcon icon={faCircle} style={{fontSize: "5px"}} />
                <p className="is-size-7">{msToHoursMinutes(movie.duration)}</p>
              </RowLayout>
            </ColumnLayout>

            <RowLayout justifyContent="space-between" wrap="wrap">
              <button
                className="button is-plex-button"
                type="button"
                onClick={() => window.open(movie.webUrl)}
              >
                <span className="icon">
                  <img className="icon-left" src={logo} alt="Plex logo"/>
                </span>
                <span>Open in Plex</span>
              </button>

              <Rating>
                <CircularProgressbar
                  value={getRatingPercentage(movie.rating)}
                  text={`${getRatingPercentage(movie.rating)}%`}
                  styles={buildStyles({
                    textColor: "black",
                    pathColor: getColorRating(getRatingPercentage(movie.rating)),
                  })}
                />
              </Rating>
            </RowLayout>
          </RowLayout>

          <br/>

          <p className="is-size-6">{movie.summary}</p>

          <br/>

          <RowLayout justifyContent="space-between">
            <ColumnLayout>
              <p className="is-size-6">Directed by</p>
              <p className="is-size-7">{movie.directors.map((director, index) => director + (index+1 === movie.directors.length ? "" : ", "))}</p>
            </ColumnLayout>
            <ColumnLayout>
              <p className="is-size-6">Studio</p>
              <p className="is-size-7">{movie.studio}</p>
            </ColumnLayout>
            <ColumnLayout>
              <p className="is-size-6">Actors</p>
              <p className="is-size-7">{movie.actors.map((actor, index) => actor + (index+1 === movie.actors.length ? "" : ", "))}</p>
            </ColumnLayout>
          </RowLayout>

        </MainColumnLayout>

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
