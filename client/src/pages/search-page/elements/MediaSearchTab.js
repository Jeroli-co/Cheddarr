import React, { useEffect, useState } from "react";
import { useSearch } from "../../../hooks/useSearch";
import { Spinner } from "../../../elements/Spinner";
import { SEARCH_TYPES } from "../../../models/SearchTypes";
import { MovieCard } from "../../../elements/media/MovieCard";
import { SeriesCard } from "../../../elements/media/SeriesCard";

const initialState = {
  media: [],
  isLoading: true,
};

const MediaSearchTab = (title) => {
  const [data, setData] = useState(initialState);
  const { search } = useSearch();

  useEffect(() => {
    search(SEARCH_TYPES.ALL, title).then((res) => {
      setData({ media: res.data, isLoading: false });
    });
  }, []);

  if (data.isLoading)
    return <Spinner color="primary" size="2x" justifyContent="center" />;

  return data.media.map((media) => {
    switch (media.type) {
      case SEARCH_TYPES.MOVIES:
        return <MovieCard movie={media} />;
      case SEARCH_TYPES.SERIES:
        return <SeriesCard series={media} />;
      default:
        console.log("No type matched");
        break;
    }
  });
};

export { MediaSearchTab };
