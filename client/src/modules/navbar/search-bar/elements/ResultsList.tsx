import React from "react";
import styled from "styled-components";
import { ColumnLayout, RowLayout } from "../../../../utils/elements/layouts";
import { Text } from "../../../../utils/strings";
import { useHistory } from "react-router";
import { routes } from "../../../../router/routes";
import Spinner from "../../../../utils/elements/Spinner";
import {
  IMediaServerMedia,
  IMediaServerSeries,
  isMediaServerMedia,
  isMediaServerMovie,
  isMediaServerSeries,
} from "../../../media-servers/models/IMediaServerMedia";
import { IPublicUser, isPublicUser } from "../../../user/models/IPublicUser";
import { SearchRequestTypes } from "../../../search/enums/SearchRequestTypes";

const ResultsListStyle = styled.div<{ isVisible: boolean }>`
  position: absolute;
  top: 100%;
  width: 100%;
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
  background: white;
  z-index: 1;
  border: 1px solid LightGrey;
  visibility: ${(props) => (props.isVisible ? "visible" : "hidden")};
`;

const ResultImage = styled.img`
  width: 30px;
  height: 50px;
`;

const ResultsSectionTitle = styled.div`
  font-size: 0.8em;
  font-weight: 400;
  background-color: rgba(212, 212, 212, 0.5);
  border-bottom: 1px solid LightGrey;
`;

const ResultStyle = styled.div`
  &:hover {
    background-color: #f5f5f5;
  }
`;

type MediaResultProps = {
  media: IMediaServerMedia | IMediaServerSeries;
};

const MediaResult = ({ media }: MediaResultProps) => {
  const history = useHistory();
  const redirectToMediaPage = () => {
    let url = "";
    if (isMediaServerSeries(media)) {
      url = routes.SERIES.url(media.id.toString());
    } else if (isMediaServerMovie(media)) {
      url = routes.MOVIE.url(media.id.toString());
    }
    history.push(url);
  };
  return (
    <ResultStyle onMouseDown={() => redirectToMediaPage()}>
      <RowLayout className="is-pointed" padding="1%" childMarginRight="2%">
        <ResultImage src={media.thumbUrl} alt="Thumb" />
        <ColumnLayout>
          <Text fontSize="0.9em" lineClamp={1}>
            {media.title}
          </Text>
          <Text fontSize="0.8em" fontWeight="lighter">
            {media.releaseDate?.getFullYear()}
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
        <ResultImage src={user["avatar"]} alt="User" />
        <Text fontSize="0.9em">@{user.username}</Text>
      </RowLayout>
    </ResultStyle>
  );
};

interface IAllSortedResults {
  friends: IPublicUser[];
  movies: IMediaServerMedia[];
  series: IMediaServerSeries[];
}

const sortSearchResult = (results: Array<IPublicUser | IMediaServerMedia>) => {
  const sortedResults: IAllSortedResults = {
    friends: [],
    movies: [],
    series: [],
  };
  results.forEach((result) => {
    if (isPublicUser(result)) {
      sortedResults.friends.push(result);
    } else if (isMediaServerSeries(result)) {
      sortedResults.series.push(result);
    } else if (isMediaServerMovie(result)) {
      sortedResults.movies.push(result);
    }
  });
  return sortedResults;
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
  results: any;
};

const SearchResultsItems = ({
  type,
  searchValue,
  results,
}: SearchResultItemsProps) => {
  if (!results) {
    return <div />;
  }

  if (results.length === 0) {
    return (
      <div>
        <SearchOnlineButton type={type} searchValue={searchValue} />
        <p>No results found</p>
      </div>
    );
  }

  if (type === SearchRequestTypes.ALL) {
    const sortedResult = sortSearchResult(results);

    return (
      <div>
        <SearchOnlineButton type={type} searchValue={searchValue} />
        {sortedResult.friends.length > 0 && (
          <div>
            <ResultsSectionTitle>Friends</ResultsSectionTitle>
            {sortedResult.friends.map((friend, index) => (
              <FriendResult key={index} user={friend} />
            ))}
          </div>
        )}
        {sortedResult.movies.length > 0 && (
          <div>
            <ResultsSectionTitle>Movies</ResultsSectionTitle>
            {sortedResult.movies.map((movie, index) => (
              <MediaResult key={index} media={movie} />
            ))}
          </div>
        )}
        {sortedResult.series.length > 0 && (
          <div>
            <ResultsSectionTitle>Series</ResultsSectionTitle>
            {sortedResult.series.map((series, index) => (
              <MediaResult key={index} media={series} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return results.map(
    (result: IMediaServerMedia | IPublicUser, index: number) => {
      if (isMediaServerMedia(result)) {
        return <MediaResult key={index} media={result} />;
      } else if (isPublicUser(result)) {
        return <FriendResult key={index} user={result} />;
      } else {
        return <div />;
      }
    }
  );
};

type ResultsListProps = {
  searchValue: string;
  isVisible: boolean;
  searchType: SearchRequestTypes;
  results: { data: IPublicUser[] | IMediaServerMedia[]; loading: boolean };
};

const ResultsList = ({
  searchValue,
  isVisible,
  searchType,
  results,
}: ResultsListProps) => {
  return (
    <ResultsListStyle
      isVisible={isVisible && (results.data !== undefined || results.loading)}
    >
      {!results.loading && (
        <SearchResultsItems
          searchValue={searchValue}
          type={searchType}
          results={results.data}
        />
      )}
      {results.loading && <Spinner color="primary" size="lg" />}
    </ResultsListStyle>
  );
};

export { ResultsList };
