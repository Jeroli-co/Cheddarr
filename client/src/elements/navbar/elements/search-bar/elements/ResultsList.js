import React from "react";
import { Spinner } from "../../../../Spinner";
import styled from "styled-components";
import { ColumnLayout, RowLayout } from "../../../../layouts";
import { cutString, Text } from "../../../../../utils/strings";
import { useHistory } from "react-router";
import { routes } from "../../../../../router/routes";

const ResultsListStyle = styled.div`
  position: absolute;
  top: 75%;
  left: 120px;
  width: calc(100% - 120px);
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
  background: white;
  z-index: 1;
  border: 1px solid LightGrey;
  visibility: ${(props) => (props.isVisible ? "visible" : "hidden")};
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
    <ResultStyle onClick={() => redirectToMediaPage()}>
      <RowLayout className="is-pointed" padding="1%" childMarginRight="2%">
        <img src={media.thumbUrl} alt="Movie" width="30" height="50" />
        <ColumnLayout>
          <Text fontSize="0.9em">{cutString(media.title, 40)}</Text>
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
      onClick={() =>
        history.push(routes.USER_FRIEND_PROFILE.url(user.username))
      }
    >
      <RowLayout padding="1%" childMarginRight="2%">
        <img src={user["user_picture"]} alt="User" width="30" height="50" />
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

const SearchResultsItems = ({ type, results }) => {
  if (type === "all") {
    const sortedResult = sortSearchResult(results);

    if (results.length === 0) {
      return <p>No results found</p>;
    }

    return (
      <div>
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

const ResultsList = ({ isVisible, isLoading, searchType, results }) => {
  return (
    <ResultsListStyle isVisible={isVisible}>
      {!isLoading && <SearchResultsItems type={searchType} results={results} />}
      {isLoading && (
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
