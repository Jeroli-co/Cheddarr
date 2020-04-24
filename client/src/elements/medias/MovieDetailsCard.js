import React, { useEffect, useState } from "react";
import styled from "styled-components";
import logo from "../../assets/plex.png";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Tag, TagColor } from "../Tag";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { usePlex } from "../../hooks/usePlex";
import { Spinner } from "../Spinner";

const MovieDetailsCardStyle = styled.div`
  position: relative;
  width: 80vw;
  padding: 1%;
  font-weight: 600;
  color: ${(props) => props.theme.dark};
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

const MoviePoster = styled.div`
  min-width: 25%;
  max-width: 25%;

  > img {
    width: 100%;
    height: auto;
    border-radius: 12px;
  }
`;

const ColumnLayout = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: ${(props) =>
    props.justifyContent ? props.justifyContent : "flex-start"};
  width: 100%;
  height: ${(props) => (props.height ? props.height : "auto")};
`;

const RowLayout = styled.div`
  display: flex;
  justify-content: ${(props) =>
    props.justifyContent ? props.justifyContent : "flex-start"};
  align-items: ${(props) => (props.alignItems ? props.alignItems : "center")};
  width: 100%;

  > * {
    margin: 1%;
  }
`;

const Rating = styled.div`
  width: 60px;
`;

const getColorRating = (rating) => "hsl(" + rating + ", 100%, 50%)";
const getRatingPercentage = (rating) => rating * 10;

const MovieDetailsCard = ({ id }) => {
  const { getMovie } = usePlex();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    getMovie(id).then((m) => {
      if (m) setMovie(m);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log(movie);
  });

  if (!movie)
    return (
      <div className="has-text-primary">
        <Spinner />
      </div>
    );

  return (
    <MovieDetailsCardStyle>
      <MovieDetailsCardBackground />
      <MovieDetailsCardBackgroundImage backgroundImage={movie.artUrl} />

      <RowLayout alignItems="flex-start">
        <MoviePoster>
          <img src={movie.posterUrl} alt="poster" />
        </MoviePoster>

        <ColumnLayout justifyContent="space-around" height="100%">
          <ColumnLayout>
            <p className="is-size-2">{movie.title}</p>
            <RowLayout childsMarginRight="1%">
              {movie.genres.map((genre, index) => (
                <Tag key={index} type={TagColor.INFO} content={genre.name} />
              ))}
              <FontAwesomeIcon icon={faCircle} style={{ fontSize: "5px" }} />
              <p className="is-size-7">{movie.releaseDate}</p>
              <FontAwesomeIcon icon={faCircle} style={{ fontSize: "5px" }} />
              <p className="is-size-7">{msToHoursMinutes(movie.duration)}</p>
            </RowLayout>

            <RowLayout>
              <Rating>
                <CircularProgressbar
                  value={getRatingPercentage(movie.rating)}
                  text={`${getRatingPercentage(movie.rating)}%`}
                  styles={buildStyles({
                    textColor: "black",
                    pathColor: getColorRating(
                      getRatingPercentage(movie.rating)
                    ),
                  })}
                />
              </Rating>
              <button
                className="button is-plex-button"
                type="button"
                onClick={() => window.open(movie.webUrl)}
              >
                <span className="icon">
                  <img className="icon-left" src={logo} alt="Plex logo" />
                </span>
                <span>Open in Plex</span>
              </button>
            </RowLayout>
          </ColumnLayout>

          <div className="is-size-5">Overview</div>
          <div className="is-size-6">{movie.summary}</div>

          <RowLayout justifyContent="space-between" alignItems="flex-start">
            <ColumnLayout>
              <p className="is-size-6">Directed</p>
              {movie.directors.map((director, index) => (
                <p className="is-size-7" key={index}>
                  {director.name +
                    (index + 1 === movie.directors.length ? "" : ", ")}
                </p>
              ))}
            </ColumnLayout>
            <ColumnLayout>
              <p className="is-size-6">Studio</p>
              <p className="is-size-7">{movie.studio}</p>
            </ColumnLayout>
            <ColumnLayout>
              <p className="is-size-6">Actors</p>
              {movie.actors.map((actor, index) => (
                <p className="is-size-7" key={index}>
                  {actor.name + (index + 1 === movie.actors.length ? "" : ", ")}
                </p>
              ))}
            </ColumnLayout>
          </RowLayout>
        </ColumnLayout>
      </RowLayout>
    </MovieDetailsCardStyle>
  );
};

const msToHoursMinutes = (ms) => {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.ceil((ms - hours * 3600000) / 60000);
  return hours + "h " + minutes + "m";
};

export { MovieDetailsCard };
