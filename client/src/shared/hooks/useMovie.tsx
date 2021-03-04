import { useEffect, useState } from "react";
import { DefaultAsyncCall, IAsyncCall } from "../models/IAsyncCall";
import { useAPI } from "./useAPI";
import { APIRoutes } from "../enums/APIRoutes";
import { useAlert } from "../contexts/AlertContext";
import { IMovie } from "../models/IMedia";

export const useMovie = (movieId: number) => {
  const [movie, setMovie] = useState<IAsyncCall<IMovie | null>>(
    DefaultAsyncCall
  );
  const { get } = useAPI();
  const { pushDanger } = useAlert();

  useEffect(() => {
    get<IMovie>(APIRoutes.GET_MOVIE(movieId)).then((res) => {
      if (res.status !== 200) {
        pushDanger("Cannot get movie");
      } else {
        setMovie(res);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movieId]);

  return movie;
};
