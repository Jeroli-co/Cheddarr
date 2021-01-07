import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { SearchedMovieCard } from "./components/SearchedMovieCard";
import { SearchedSeriesCard } from "./components/SearchedSeriesCard";
import { Container } from "../../../shared/components/Container";
import Spinner from "../../../shared/components/Spinner";
import { SearchRequestTypes } from "../../enums/SearchRequestTypes";
import { isSearchedSeries } from "./models/ISearchedMedias";
import { MediaTypes } from "../../enums/MediaTypes";
import { useFriendsMoviesProviders } from "../../hooks/useFriendsMoviesProviders";
import { useFriendsSeriesProviders } from "../../hooks/useFriendsSeriesProviders";
import {
  DefaultAsyncCall,
  IAsyncCall,
} from "../../../shared/models/IAsyncCall";
import { useSearchMedia } from "../../hooks/useSearchMedia";
import { ISearchMediaResult } from "./models/ISearchMediaResult";
import { SwitchErrors } from "../../../shared/components/errors/SwitchErrors";

type SearchParams = {
  type: SearchRequestTypes;
  title: string;
};

const Search = () => {
  const { type, title } = useParams<SearchParams>();

  const { getAllMediaByTitle } = useSearchMedia();
  const [searchMediaResult, setSearchMediaResult] = useState<
    IAsyncCall<ISearchMediaResult | null>
  >(DefaultAsyncCall);

  const friendsMoviesProviders = useFriendsMoviesProviders();
  const friendsSeriesProviders = useFriendsSeriesProviders();

  useEffect(() => {
    getAllMediaByTitle(title).then((res) => setSearchMediaResult(res));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, title]);

  let content;

  if (searchMediaResult.isLoading) return <Spinner color="primary" size="2x" />;
  if (searchMediaResult.data === null)
    return <SwitchErrors status={searchMediaResult.status} />;

  if (searchMediaResult.data.results.length === 0) {
    content = (
      <div className="content has-text-centered">
        <h1 className="title is-3 has-text-grey-dark has-text-weight-light">
          Could not find any result for "{title}"
        </h1>
      </div>
    );
  } else {
    content = searchMediaResult.data.results.map((media, index) => {
      switch (media.mediaType) {
        case MediaTypes.MOVIES:
          if (friendsMoviesProviders.data) {
            return (
              <SearchedMovieCard
                key={index}
                movie={media}
                friendsProviders={friendsMoviesProviders.data}
              />
            );
          }
          break;
        case MediaTypes.SERIES:
          if (isSearchedSeries(media) && friendsSeriesProviders.data) {
            return (
              <SearchedSeriesCard
                key={index}
                series={media}
                friendsProviders={friendsSeriesProviders.data}
              />
            );
          }
          break;
        default:
          throw new Error("No type matched");
      }
      return <div key={index} />;
    });
  }

  return <Container padding="1%">{content}</Container>;
};

export { Search };
