import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { MoviesSearchTab } from "./elements/MoviesSearchTab";
import { SeriesSearchTab } from "./elements/SeriesSearchTab";
import { MediaSearchTab } from "./elements/MediaSearchTab";
import { SEARCH_TYPES } from "../../enums/SearchTypes";
import { useSearch } from "../../hooks/useSearch";
import { Spinner } from "../../elements/Spinner";

const initialState = {
  media: [],
  isLoading: true,
};

const SearchPage = () => {
  const { type, title } = useParams();
  const [data, setData] = useState(initialState);
  const { searchOnline } = useSearch();

  useEffect(() => {
    searchOnline(type, title).then((res) => {
      setData({ media: res.results, isLoading: false });
    });
  }, []);

  if (data.isLoading)
    return <Spinner color="primary" size="2x" justifyContent="center" />;

  switch (type) {
    case SEARCH_TYPES.ALL:
      return <MediaSearchTab data={data.media} />;
    case SEARCH_TYPES.MOVIES:
      return <MoviesSearchTab />;
    case SEARCH_TYPES.SERIES:
      return <SeriesSearchTab />;
    default:
      console.log("No type matched");
      break;
  }
};

export { SearchPage };
