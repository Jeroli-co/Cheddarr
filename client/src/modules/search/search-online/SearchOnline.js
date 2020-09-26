import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useSearch } from "../hooks/useSearch";
import { Spinner } from "../../../utils/elements/Spinner";
import { SEARCH_RESULTS } from "../enums/SearchResults";
import { OnlineMovieCard } from "./elements/OnlineMovieCard";
import { OnlineSeriesCard } from "./elements/OnlineSeriesCard";
import { Container } from "../../../utils/elements/Container";
import { useFriends } from "../../user/friends/hooks/useFriends";

const initialState = {
  results: [],
  isLoading: true,
};

const SearchOnline = () => {
  const { type, title } = useParams();
  const [data, setData] = useState(initialState);
  const { searchOnline } = useSearch();
  const { getFriendsProvider } = useFriends();
  const [friendsMoviesProviders, setFriendsMoviesProviders] = useState([]);
  const [friendsSeriesProviders, setFriendsSeriesProviders] = useState([]);

  useEffect(() => {
    searchOnline(type, title).then((res) => {
      setData({ results: res.results, isLoading: false });
      getFriendsProvider("movies").then((fmp) =>
        setFriendsMoviesProviders(fmp)
      );
      getFriendsProvider("series").then((fsp) =>
        setFriendsSeriesProviders(fsp)
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, title]);

  let content;

  if (data.isLoading) {
    content = <Spinner color="primary" size="2x" justifyContent="center" />;
  } else {
    if (data.results.length === 0) {
      content = (
        <div className="content has-text-centered">
          <h1 className="title is-3 has-text-grey-dark has-text-weight-light">
            Could not find any result for "{title}"
          </h1>
        </div>
      );
    } else {
      content = data.results.map((media, index) => {
        switch (media["media_type"]) {
          case SEARCH_RESULTS.MOVIE:
            return (
              <OnlineMovieCard
                key={index}
                movie={media}
                friendsProviders={friendsMoviesProviders}
              />
            );
          case SEARCH_RESULTS.SERIES:
            return (
              <OnlineSeriesCard
                key={index}
                series={media}
                friendsProviders={friendsSeriesProviders}
              />
            );
          default:
            console.log("No type matched");
            return <div />;
        }
      });
    }
  }

  return <Container padding="1%">{content}</Container>;
};

export { SearchOnline };
