import { useEffect, useState } from "react";
import { DefaultAsyncCall, IAsyncCall } from "../models/IAsyncCall";
import { useAPI } from "./useAPI";
import { APIRoutes } from "../enums/APIRoutes";
import { useAlert } from "../contexts/AlertContext";
import { IMovie } from "../models/IMedia";

export const useMovie = (movieId: string) => {
  const [movie, setMovie] = useState<IAsyncCall<IMovie | null>>(
    DefaultAsyncCall
  );
  const { get } = useAPI();
  const { pushDanger } = useAlert();

  const fetchMovie = () => {
    get<IMovie>(APIRoutes.GET_MOVIE(movieId)).then((res) => {
      if (res.status !== 200) {
        pushDanger("Cannot get movie");
        setMovie({ ...DefaultAsyncCall, isLoading: false });
      } else {
        setMovie(res);
      }
    });
  };

  useEffect(() => {
    if (!movie.isLoading) {
      setMovie(DefaultAsyncCall);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movieId]);

  useEffect(() => {
    if (movie.isLoading) {
      fetchMovie();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movie.isLoading]);

  return movie;
};
