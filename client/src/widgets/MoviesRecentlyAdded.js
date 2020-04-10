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
    <div className="columns is-multiline">
      { movies.map((movie) =>
        <div className="column is-one-fifth">
          <Movie key={movie.title} movie={movie}/>
        </div>
      )}
    </div>
  );

};

export {
  MoviesRecentlyAdded
}
