import React from "react";
import styled from "styled-components";

const MovieStyle = styled.div`
  min-height: 200px;
  min-width: 120px;
  background-image: url(${({ movie }) => movie.poster});

  > .title {
    visibility: hidden;
  }

  &:hover {
    opacity: 0.2;
    > .title {
      visibility: visible;
    }
  }
`;

const Movie = ({ movie }) => {
  return (
    <MovieStyle>
      <h2 className="title is-2">{movie.title}</h2>
    </MovieStyle>
  );
};

export {
  Movie
}
