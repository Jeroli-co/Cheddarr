import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import logo from "../../assets/plex.png";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Tag, TagColor } from "../Tag";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { usePlex } from "../../hooks/usePlex";
import { Spinner } from "../Spinner";
import { Carousel } from "../Carousel";

const MovieDetailsCardStyle = styled.div`
  position: relative;
  width: 80vw;
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

const MoviePoster = styled.img`
  width: 100%;
  height: auto;
  border-radius: 12px;
`;

const ColumnLayout = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: ${(props) =>
    props.justifyContent ? props.justifyContent : "flex-start"};
  width: ${(props) => (props.width ? props.width : "100%")};
  height: ${(props) => (props.height ? props.height : "auto")};
`;

const RowLayout = styled.div`
  display: flex;
  flex-wrap: ${(props) => (props.wrap ? props.wrap : "nowrap")};
  justify-content: ${(props) =>
    props.justifyContent ? props.justifyContent : "flex-start"};
  align-items: ${(props) => (props.alignItems ? props.alignItems : "center")};
  width: 100%;

  > * {
    margin: 1%;
  }

  @media only screen and (max-width: 768px) {
    ${(props) =>
      props.justifyContentTablet &&
      css`
        justify-content: ${props.justifyContentTablet};
      `};

    ${(props) =>
      props.alignItemsTablet &&
      css`
        align-items: ${props.alignItemsTablet};
      `};
  }
`;

const Rating = styled.div`
  width: 60px;
`;

const Actor = styled.div`
  margin: 1%;
`;

const ActorPicture = styled.img`
  min-width: 120px;
  max-width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  object-position: 50% 50%;
`;

const ActorInitials = styled.div`
  min-width: 120px;
  max-width: 120px;
  height: 120px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.transparentDark};
  color: ${(props) => props.theme.dark};
  font-size: 2em;
`;

const getColorRating = (rating) => "hsl(" + rating + ", 100%, 50%)";
const getRatingPercentage = (rating) => rating * 10;

const MovieDetailsCard = ({ movie }) => {
  const { getMovie } = usePlex();
  const [movieDetails, setMovieDetails] = useState(null);

  useEffect(() => {
    getMovie(movie.id).then((m) => {
      if (m) setMovieDetails(m);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log(movieDetails);
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
        <ColumnLayout width="25%">
          <MoviePoster src={movie.thumbUrl} alt={movie.title} />
        </ColumnLayout>

        <ColumnLayout justifyContent="space-around" width="75%" height="100%">
          <ColumnLayout>
            <p className="is-size-2">{movie.title}</p>
            <RowLayout wrap="wrap">
              <p className="is-size-7">{movie.releaseDate}</p>
              <FontAwesomeIcon icon={faCircle} style={{ fontSize: "5px" }} />
              <p className="is-size-7">{msToHoursMinutes(movie.duration)}</p>
              <FontAwesomeIcon icon={faCircle} style={{ fontSize: "5px" }} />
              {movieDetails &&
                movieDetails.genres.map((genre, index) => (
                  <Tag key={index} type={TagColor.INFO} content={genre.name} />
                ))}
              {!movieDetails && <Spinner />}
            </RowLayout>

            <RowLayout>
              <Rating>
                <CircularProgressbar
                  value={getRatingPercentage(movie.rating)}
                  text={`${getRatingPercentage(movie.rating)}%`}
                  background
                  styles={buildStyles({
                    textColor: "GhostWhite",
                    pathColor: getColorRating(
                      getRatingPercentage(movie.rating)
                    ),
                    backgroundColor: "#282a2d",
                  })}
                />
              </Rating>
              <p>Rating</p>
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

          <RowLayout>
            <ColumnLayout>
              <div className="is-size-5">Overview</div>
              <div className="is-size-6">{movie.summary}</div>
            </ColumnLayout>
          </RowLayout>

          <br />

          <RowLayout alignItems="flex-start">
            <div>
              <p className="is-size-6">Directed</p>
              {movie.directors.map((director, index) => (
                <p className="is-size-7" key={index}>
                  {director.name +
                    (index + 1 === movie.directors.length ? "" : ", ")}
                </p>
              ))}
            </div>
            <div>
              <p className="is-size-6">Studio</p>
              <p className="is-size-7">{movie.studio}</p>
            </div>
          </RowLayout>
        </ColumnLayout>
      </RowLayout>

      <RowLayout>
        <ColumnLayout>
          <p className="is-size-6">Actors</p>
          {movieDetails && (
            <Carousel>
              {movieDetails.actors.map((actor) => (
                <Actor key={actor.name}>
                  {actor.thumbUrl ? (
                    <ActorPicture src={actor.thumbUrl} alt="" />
                  ) : (
                    <ActorInitials>
                      <p>{getActorInitial(actor.name)}</p>
                    </ActorInitials>
                  )}
                  <p className="is-size-7">{actor.name}</p>
                </Actor>
              ))}
            </Carousel>
          )}
          {!movieDetails && <Spinner />}
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

const getActorInitial = (name) => {
  const splitedName = name.split(" ");
  if (splitedName.length >= 2) {
    return splitedName[0][0] + " " + splitedName[splitedName.length - 1][0];
  } else if (splitedName.length === 1) {
    return splitedName[0][0];
  } else {
    return ".";
  }
};

export { MovieDetailsCard };
