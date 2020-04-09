import React, {useEffect, useState} from "react";
import {usePlex} from "../hooks/usePlex";
import {Movie} from "./Movie";

const MoviesRecentlyAdded = () => {

  const { getMoviesRecentlyAdded } = usePlex();
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    getMoviesRecentlyAdded().then(data => { if (data) setMovies(data) })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    movies.map(movie => <Movie key={movie.title} movie={movie}/>)
  );

};

export {
  MoviesRecentlyAdded
}
