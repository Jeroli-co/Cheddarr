import React from "react";
import { Spinner } from "../../../Spinner";
import styled from "styled-components";
import { ColumnLayout, RowLayout } from "../../../layouts";
import { Text } from "../../../../utils/strings";
import { useHistory } from "react-router";
import { routes } from "../../../../router/routes";
import { SEARCH_TYPES } from "../../../../enums/SearchTypes";

const ResultsListStyle = styled.div`
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

const MediaResult = ({ media }) => {
  const history = useHistory();
  const redirectToMediaPage = () => {
    let url = "";
    switch (media.type) {
      case "movie":
        url = routes.MOVIE.url(media.id);
        break;
      case "series":
        url = routes.SERIES.url(media.id);
        break;
      default:
        throw new Error("No media type matched");
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
            {media.year}
          </Text>
        </ColumnLayout>
      </RowLayout>
    </ResultStyle>
  );
};

const FriendResult = ({ user }) => {
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

const sortSearchResult = (results) => {
  const sortedResults = { friends: [], movies: [], series: [] };
  results.forEach((result) => {
    if (result.type === "movie") {
      sortedResults.movies.push(result);
    } else if (result.type === "series") {
      sortedResults.series.push(result);
    } else if (result.type === "friend") {
      sortedResults.friends.push(result);
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

const SearchOnlineButton = ({ type, searchValue }) => {
  const history = useHistory();
  const searchOnlineRedirect = () =>
    history.push(routes.SEARCH.url(type, searchValue));
  return (
    <SearchOnlineButtonStyle onMouseDown={() => searchOnlineRedirect()}>
      Search online
    </SearchOnlineButtonStyle>
  );
};

const SearchResultsItems = ({ type, searchValue, results }) => {
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

  if (type === SEARCH_TYPES.ALL) {
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

  return results.map((result, index) => {
    if (result.type === "movie" || result.type === "series") {
      return <MediaResult key={index} media={result} />;
    } else if (result.type === "friend") {
      return <FriendResult key={index} />;
    } else {
      return <div />;
    }
  });
};

const ResultsList = ({ searchValue, isVisible, searchType, results }) => {
  return (
    <ResultsListStyle
      isVisible={isVisible && (results.value || results.loading)}
    >
      {!results.loading && (
        <SearchResultsItems
          searchValue={searchValue}
          type={searchType}
          results={results.value}
        />
      )}
      {results.loading && (
        <Spinner
          justifyContent="center"
          color="primary"
          size="lg"
          padding="1em"
        />
      )}
    </ResultsListStyle>
  );
};

export { ResultsList };
