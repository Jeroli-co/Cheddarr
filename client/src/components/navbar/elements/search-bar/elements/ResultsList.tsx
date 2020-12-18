import React from "react";
import styled from "styled-components";
import { ColumnLayout, RowLayout } from "../../../../elements/layouts";
import { useHistory } from "react-router";
import { routes } from "../../../../../router/routes";
import {
  IMediaServerMedia,
  IMediaServerSeries,
} from "../../../../../models/IMediaServerMedia";
import { IPublicUser } from "../../../../../models/IPublicUser";
import { SearchRequestTypes } from "../../../../../enums/SearchRequestTypes";
import { Text } from "../../../../elements/Text";
import Spinner from "../../../../elements/Spinner";
import { IMediaSearchResult } from "../../../../../models/IMediaSearchResult";
import { MediasTypes } from "../../../../../enums/MediasTypes";

const ResultsListStyle = styled.div<{ isVisible: boolean }>`
  position: absolute;
  top: 100%;
  width: 100%;
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
  background: ${(props) => props.theme.bgColor};
  z-index: 1;
  border: 1px solid ${(props) => props.theme.dark};
  visibility: ${(props) => (props.isVisible ? "visible" : "hidden")};
`;

const ResultsSectionTitle = styled.div`
  font-size: 0.8em;
  font-weight: 400;
  background-color: rgba(212, 212, 212, 0.5);
  border-bottom: 1px solid LightGrey;
`;

const ResultStyle = styled.div`
  background-color: ${(props) => props.theme.bgColor};
  color: ${(props) => props.theme.color};
  &:hover {
    background-color: ${(props) => props.theme.dark};
  }
`;

type MediaResultProps = {
  media: IMediaSearchResult;
};

const MediaResult = ({ media }: MediaResultProps) => {
  const history = useHistory();
  const redirectToMediaPage = () => {
    let url = "";
    if (media.type === MediasTypes.SERIES) {
      url = routes.SERIES.url(media.id.toString());
    } else if (media.type === MediasTypes.MOVIE) {
      url = routes.MOVIE.url(media.id.toString());
    }
    history.push(url);
  };
  return (
    <ResultStyle onMouseDown={() => redirectToMediaPage()}>
      <RowLayout className="is-pointed" padding="1%" childMarginRight="2%">
        {media.posterUrl && (
          <img src={media.posterUrl} alt={media.title} width="30" height="50" />
        )}
        <ColumnLayout>
          <Text fontSize="0.9em" lineClamp={1}>
            {media.title}
          </Text>
          <Text fontSize="0.8em" fontWeight="lighter">
            {media.year}
          </Text>
        </ColumnLayout>
      </RowLayout>
    </ResultStyle>
  );
};

type FriendResultProps = {
  user: IPublicUser;
};

const FriendResult = ({ user }: FriendResultProps) => {
  const history = useHistory();
  return (
    <ResultStyle
      onMouseDown={() =>
        history.push(routes.USER_FRIEND_PROFILE.url(user.username))
      }
    >
      <RowLayout padding="1%" childMarginRight="2%">
        <img src={user.avatar} alt="User" />
        <Text fontSize="0.9em">@{user.username}</Text>
      </RowLayout>
    </ResultStyle>
  );
};

const SearchOnlineButtonStyle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 6px;
  margin: 1em;
  font-size: 0.8em;
  cursor: pointer;
`;

type SearchOnlineButtonProps = {
  type: SearchRequestTypes;
  searchValue: string;
};

const SearchOnlineButton = ({ type, searchValue }: SearchOnlineButtonProps) => {
  const history = useHistory();
  const searchOnlineRedirect = () =>
    history.push(routes.SEARCH.url(type, searchValue));
  return (
    <SearchOnlineButtonStyle onMouseDown={() => searchOnlineRedirect()}>
      Search online
    </SearchOnlineButtonStyle>
  );
};

type SearchResultItemsProps = {
  type: SearchRequestTypes;
  searchValue: string;
  moviesResults: { data: IMediaSearchResult[] | null; isLoading: boolean };
  seriesResults: { data: IMediaSearchResult[] | null; isLoading: boolean };
  friendsResults: { data: IPublicUser[] | null; isLoading: boolean };
};

const SearchResultsItems = ({
  type,
  searchValue,
  moviesResults,
  seriesResults,
  friendsResults,
}: SearchResultItemsProps) => {
  switch (type) {
    case SearchRequestTypes.ALL:
      return (
        <div>
          <SearchOnlineButton type={type} searchValue={searchValue} />
          {!moviesResults.isLoading &&
            moviesResults.data &&
            moviesResults.data.length > 0 && (
              <ResultsSectionTitle>Movies</ResultsSectionTitle>
            )}
          {moviesResults.isLoading && <Spinner />}
          {!moviesResults.isLoading &&
            moviesResults.data !== null &&
            moviesResults.data.length > 0 && (
              <div>
                {moviesResults.data.map((movie, index) => (
                  <MediaResult key={index} media={movie} />
                ))}
              </div>
            )}
          {!seriesResults.isLoading &&
            seriesResults.data &&
            seriesResults.data.length > 0 && (
              <ResultsSectionTitle>Series</ResultsSectionTitle>
            )}
          {seriesResults.isLoading && <Spinner />}
          {!seriesResults.isLoading &&
            seriesResults.data !== null &&
            seriesResults.data.length > 0 && (
              <div>
                {seriesResults.data.map((series, index) => (
                  <MediaResult key={index} media={series} />
                ))}
              </div>
            )}
          {!friendsResults.isLoading &&
            friendsResults.data &&
            friendsResults.data.length > 0 && (
              <ResultsSectionTitle>Friends</ResultsSectionTitle>
            )}
          {friendsResults.isLoading && <Spinner />}
          {!friendsResults.isLoading &&
            friendsResults.data !== null &&
            friendsResults.data.length > 0 && (
              <div>
                {friendsResults.data.map((friend, index) => (
                  <FriendResult key={index} user={friend} />
                ))}
              </div>
            )}
        </div>
      );
    case SearchRequestTypes.MOVIES:
      return (
        <div>
          {moviesResults.isLoading && <Spinner />}
          {!moviesResults.isLoading &&
            moviesResults.data !== null &&
            moviesResults.data.length > 0 && (
              <div>
                {moviesResults.data.map((movie, index) => (
                  <MediaResult key={index} media={movie} />
                ))}
              </div>
            )}
        </div>
      );
    case SearchRequestTypes.SERIES:
      return (
        <div>
          {seriesResults.isLoading && <Spinner />}
          {!seriesResults.isLoading &&
            seriesResults.data !== null &&
            seriesResults.data.length > 0 && (
              <div>
                {seriesResults.data.map((series, index) => (
                  <MediaResult key={index} media={series} />
                ))}
              </div>
            )}
        </div>
      );
    case SearchRequestTypes.FRIENDS:
      return (
        <div>
          {friendsResults.isLoading && <Spinner />}
          {!friendsResults.isLoading &&
            friendsResults.data !== null &&
            friendsResults.data.length > 0 && (
              <div>
                {friendsResults.data.map((friend, index) => (
                  <FriendResult key={index} user={friend} />
                ))}
              </div>
            )}
        </div>
      );
    default:
      throw new Error("No search type matched");
  }
};

type ResultsListProps = {
  searchValue: string;
  isInputFocus: boolean;
  searchType: SearchRequestTypes;
  moviesResults: { data: IMediaSearchResult[] | null; isLoading: boolean };
  seriesResults: { data: IMediaSearchResult[] | null; isLoading: boolean };
  friendsResults: { data: IPublicUser[] | null; isLoading: boolean };
};

const ResultsList = ({
  searchValue,
  isInputFocus,
  searchType,
  moviesResults,
  seriesResults,
  friendsResults,
}: ResultsListProps) => {
  return (
    <ResultsListStyle
      isVisible={
        isInputFocus &&
        (moviesResults.data !== null ||
          seriesResults.data !== null ||
          friendsResults.data !== null ||
          moviesResults.isLoading ||
          seriesResults.isLoading ||
          friendsResults.isLoading)
      }
    >
      <SearchResultsItems
        searchValue={searchValue}
        type={searchType}
        moviesResults={moviesResults}
        seriesResults={seriesResults}
        friendsResults={friendsResults}
      />
    </ResultsListStyle>
  );
};

export { ResultsList };
