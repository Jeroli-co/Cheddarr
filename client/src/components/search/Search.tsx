import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { SearchedMovieCard } from "./components/SearchedMovieCard";
import { SearchedSeriesCard } from "./components/SearchedSeriesCard";
import { Container } from "../elements/Container";
import Spinner from "../elements/Spinner";
import { SearchService } from "../../services/SearchService";
import { SearchRequestTypes } from "../../enums/SearchRequestTypes";
import {
  ISearchedMedias,
  isSearchedSeries,
} from "../../models/ISearchedMedias";
import { MediasTypes } from "../../enums/MediasTypes";
import { UserService } from "../../services/UserService";
import { IPublicUser } from "../../models/IPublicUser";

type SearchResultState = {
  results: Array<ISearchedMedias>;
  isLoading: boolean;
};

type SearchParams = {
  type: SearchRequestTypes;
  title: string;
};

const Search = () => {
  const { type, title } = useParams<SearchParams>();
  const [data, setData] = useState<SearchResultState>({
    results: [],
    isLoading: true,
  });
  const [friendsMoviesProviders, setFriendsMoviesProviders] = useState<
    IPublicUser[]
  >([]);
  const [friendsSeriesProviders, setFriendsSeriesProviders] = useState<
    IPublicUser[]
  >([]);

  useEffect(() => {
    SearchService.GetMediasByTitle(type, title).then((res) => {
      if (res.error === null) {
        setData({ results: res.data, isLoading: false });
        UserService.GetProviders(MediasTypes.MOVIE).then((res) => {
          if (res.error === null) {
            setFriendsMoviesProviders(res.data);
          }
        });
        UserService.GetProviders(MediasTypes.SERIES).then((res) => {
          if (res.error === null) {
            setFriendsSeriesProviders(res.data);
          }
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, title]);

  let content;

  if (data.isLoading) {
    content = <Spinner color="primary" size="2x" />;
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
        switch (media.type) {
          case MediasTypes.MOVIE:
            return (
              <SearchedMovieCard
                key={index}
                movie={media}
                friendsProviders={friendsMoviesProviders}
              />
            );
          case MediasTypes.SERIES:
            if (isSearchedSeries(media)) {
              return (
                <SearchedSeriesCard
                  key={index}
                  series={media}
                  friendsProviders={friendsSeriesProviders}
                />
              );
            }
            break;
          default:
            throw new Error("No type matched");
        }
        return <div />;
      });
    }
  }

  return <Container padding="1%">{content}</Container>;
};

export { Search };
