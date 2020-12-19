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
import { IPublicUser } from "../../models/IPublicUser";
import { FriendService } from "../../services/FriendService";
import { ProviderTypes } from "../../enums/ProviderTypes";

type SearchResultState = {
  results: ISearchedMedias[] | null;
  isLoading: boolean;
};

type SearchParams = {
  type: SearchRequestTypes;
  title: string;
};

const Search = () => {
  const { type, title } = useParams<SearchParams>();
  const [data, setData] = useState<SearchResultState>({
    results: null,
    isLoading: true,
  });
  const [friendsMoviesProviders, setFriendsMoviesProviders] = useState<
    IPublicUser[]
  >([]);
  const [friendsSeriesProviders, setFriendsSeriesProviders] = useState<
    IPublicUser[]
  >([]);

  useEffect(() => {
    console.log(title);
  }, [title]);

  useEffect(() => {

    FriendService.GetFriendsProviders(ProviderTypes.MOVIES).then((res) => {
      if (res.error === null) {
        setFriendsMoviesProviders(res.data);
      }
    });

    FriendService.GetFriendsProviders(ProviderTypes.SERIES).then((res) => {
      if (res.error === null) {
        setFriendsSeriesProviders(res.data);
      }
    });

    SearchService.GetMediasByTitle(type, title).then((res) => {
      if (res.error === null) {
        setData({ results: res.data.results, isLoading: false });
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, title]);

  let content;

  if (data.isLoading || data.results === null) {
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
        switch (media.mediaType) {
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
        return <div key={index} />;
      });
    }
  }

  return <Container padding="1%">{content}</Container>;
};

export { Search };
