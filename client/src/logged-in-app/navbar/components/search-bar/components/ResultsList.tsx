import React from "react";
import styled from "styled-components";
import { ColumnLayout } from "../../../../../shared/components/layout/Layouts";
import { useHistory } from "react-router";
import { routes } from "../../../../../router/routes";
import { IPublicUser } from "../../../../models/IPublicUser";
import { SearchRequestTypes } from "../../../../enums/SearchRequestTypes";
import { Text } from "../../../../../shared/components/Text";
import Spinner, {
  PrimarySpinner,
} from "../../../../../shared/components/Spinner";
import { IMediaSearchResult } from "../models/IMediaSearchResult";
import { Image } from "../../../../../shared/components/Image";
import { useRedirectToMediasDetails } from "../../../../hooks/useRedirectToMediasDetails";
import { STATIC_STYLES } from "../../../../../shared/enums/StaticStyles";

const ResultsListStyle = styled.div<{ isVisible: boolean }>`
  position: absolute;
  top: 100%;
  width: 100%;
  border-bottom: 1px solid ${STATIC_STYLES.COLORS.GRAY};
  border-right: 1px solid ${STATIC_STYLES.COLORS.GRAY};
  border-left: 1px solid ${STATIC_STYLES.COLORS.GRAY};
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
  background: ${(props) => props.theme.bgColor};
  z-index: 10;
  visibility: ${(props) => (props.isVisible ? "visible" : "hidden")};
`;

const ResultsSectionTitle = styled.div`
  font-size: 0.8em;
  font-weight: 400;
  background-color: #dedede;
  border-bottom: 1px solid LightGrey;
`;

const ResultStyle = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  color: ${(props) => props.theme.color};
  padding: 1%;

  &:hover {
    background-color: ${(props) => props.theme.highlight};
  }
`;

type MediaResultProps = {
  medias: IMediaSearchResult;
};

const MediaResult = ({ medias }: MediaResultProps) => {
  const { redirectToMediaPage } = useRedirectToMediasDetails();

  return (
    <ResultStyle onMouseDown={() => redirectToMediaPage(medias)}>
      {medias.posterUrl && (
        <Image
          src={medias.posterUrl}
          alt={medias.title}
          width="35px"
          height="50px"
        />
      )}
      <ColumnLayout marginLeft="10px">
        <Text fontSize="0.9em" lineClamp={1}>
          {medias.title}
        </Text>
        <Text fontSize="0.8em" fontWeight="lighter">
          {medias.year}
        </Text>
      </ColumnLayout>
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
      onMouseDown={() => history.push(routes.PUBLIC_USER.url(user.username))}
    >
      <Image src={user.avatar} alt="User" width="50px" height="50px" />
      <Text fontSize="0.9em" marginLeft="10px">
        @{user.username}
      </Text>
    </ResultStyle>
  );
};

const SearchOnlineButtonStyle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #dedede;
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
          {moviesResults.isLoading && <PrimarySpinner />}
          {!moviesResults.isLoading &&
            moviesResults.data !== null &&
            moviesResults.data.length > 0 && (
              <div>
                {moviesResults.data.map((movie, index) => (
                  <MediaResult key={index} medias={movie} />
                ))}
              </div>
            )}
          {!seriesResults.isLoading &&
            seriesResults.data &&
            seriesResults.data.length > 0 && (
              <ResultsSectionTitle>Series</ResultsSectionTitle>
            )}
          {seriesResults.isLoading && <PrimarySpinner />}
          {!seriesResults.isLoading &&
            seriesResults.data !== null &&
            seriesResults.data.length > 0 && (
              <div>
                {seriesResults.data.map((series, index) => (
                  <MediaResult key={index} medias={series} />
                ))}
              </div>
            )}
          {!friendsResults.isLoading &&
            friendsResults.data &&
            friendsResults.data.length > 0 && (
              <ResultsSectionTitle>Friends</ResultsSectionTitle>
            )}
          {friendsResults.isLoading && <PrimarySpinner />}
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
                  <MediaResult key={index} medias={movie} />
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
                  <MediaResult key={index} medias={series} />
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
