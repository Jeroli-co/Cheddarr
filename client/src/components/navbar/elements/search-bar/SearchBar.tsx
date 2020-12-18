import React, {
  ChangeEvent,
  KeyboardEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import styled, { css } from "styled-components";
import { isEmpty } from "../../../../utils/strings";
import { DropdownType } from "./elements/DropdownType";
import { ResultsList } from "./elements/ResultsList";
import { useHistory } from "react-router";
import { routes } from "../../../../router/routes";
import { SearchRequestTypes } from "../../../../enums/SearchRequestTypes";
import { PlexService } from "../../../../services/PlexService";
import { IPublicUser } from "../../../../models/IPublicUser";
import { MediasTypes } from "../../../../enums/MediasTypes";
import { FriendService } from "../../../../services/FriendService";
import { PlexConfigContext } from "../../../../contexts/plex-config/PlexConfigContext";
import { IMediaSearchResult } from "../../../../models/IMediaSearchResult";

const SearchBarStyle = styled.div<{ isInputFocus: boolean }>`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  transition: 0.3s ease;

  @media only screen and (min-width: 1024px) {
    width: 33%;
  }

  .search-input {
    border: 1px solid green;
    width: 100%;
    height: 100%;
    border: 1px solid ${(props) => props.theme.primaryLight};
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
    background-color: ${(props) => props.theme.primaryLight};
    transition: 0.3s ease;
    color: black;
    opacity: 0.5;
    text-indent: 25px;
    outline: none;

    ::placeholder {
      color: ${(props) => props.theme.dark};
    }
  }

  ${({ isInputFocus }) =>
    isInputFocus &&
    css`
      @media only screen and (min-width: 1024px) {
        width: 40%;
      }

      .search-input {
        opacity: 1;

        @media only screen and (max-width: 768px) {
          width: 100%;
        }
      }
    `}
`;

let timer: number = 0;

const SearchBar = () => {
  const [searchType, setSearchType] = useState<SearchRequestTypes>(
    SearchRequestTypes.ALL
  );
  const [isInputFocus, setIsInputFocus] = useState(false);
  const [value, setValue] = useState("");

  const initialSearchState = { data: null, isLoading: false };
  const [moviesResults, setMoviesResults] = useState<{
    data: IMediaSearchResult[] | null;
    isLoading: boolean;
  }>(initialSearchState);
  const [seriesResults, setSeriesResults] = useState<{
    data: IMediaSearchResult[] | null;
    isLoading: boolean;
  }>(initialSearchState);
  const [friendsResults, setFriendsResults] = useState<{
    data: IPublicUser[] | null;
    isLoading: boolean;
  }>(initialSearchState);
  const { currentConfig } = useContext(PlexConfigContext);

  const history = useHistory();
  const inputRef = useRef<HTMLInputElement>(null);

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    e.preventDefault();
  };

  const onKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && value.length > 0) {
      console.log("HEHE");
      history.push(routes.SEARCH.url(searchType, value));
      setValue("");
    }
  };

  const onSearchTypeChange = (type: SearchRequestTypes) => {
    if (inputRef && inputRef.current) {
      setSearchType(type);
      inputRef.current.focus();
    }
  };

  const _search = () => {
    if (!isEmpty(value) && value.length > 1) {
      switch (searchType) {
        case SearchRequestTypes.MOVIES:
          setMoviesResults({ ...moviesResults, isLoading: true });
          break;
        case SearchRequestTypes.SERIES:
          setSeriesResults({ ...seriesResults, isLoading: true });
          break;
        case SearchRequestTypes.FRIENDS:
          setFriendsResults({ ...friendsResults, isLoading: true });
          break;
        case SearchRequestTypes.ALL:
          setMoviesResults({ ...moviesResults, isLoading: true });
          setSeriesResults({ ...seriesResults, isLoading: true });
          setFriendsResults({ ...friendsResults, isLoading: true });
          break;
        default:
          throw new Error("No search type matched");
      }
    }
  };

  useEffect(() => {
    clearTimeout(timer);
    timer = setTimeout(() => _search(), 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    if (currentConfig) {
      if (moviesResults.isLoading) {
        PlexService.SearchPlexMedias(
          currentConfig.id,
          MediasTypes.MOVIE,
          value
        ).then((res) => {
          if (res.error === null) {
            console.log("HEHE");
            setMoviesResults({ data: res.data, isLoading: false });
          }
        });
      }

      if (seriesResults.isLoading) {
        PlexService.SearchPlexMedias(
          currentConfig.id,
          MediasTypes.SERIES,
          value
        ).then((res) => {
          if (res.error === null) {
            setSeriesResults({ data: res.data, isLoading: false });
          }
        });
      }
    }

    if (friendsResults.isLoading) {
      FriendService.SearchFriends(value).then((res) => {
        if (res.error === null) {
          setFriendsResults({ data: res.data, isLoading: false });
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    moviesResults.isLoading,
    seriesResults.isLoading,
    friendsResults.isLoading,
  ]);

  useEffect(() => {
    _search();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchType]);

  return (
    <SearchBarStyle isInputFocus={isInputFocus}>
      <DropdownType selectedOption={searchType} onChange={onSearchTypeChange} />
      <input
        ref={inputRef}
        value={value}
        onChange={onInputChange}
        onFocus={() => setIsInputFocus(true)}
        onBlur={() => setIsInputFocus(false)}
        onKeyPress={onKeyPress}
        className="search-input"
        type="text"
        placeholder="Search..."
      />
      <ResultsList
        searchValue={value}
        isInputFocus={isInputFocus}
        searchType={searchType}
        moviesResults={moviesResults}
        seriesResults={seriesResults}
        friendsResults={friendsResults}
      />
    </SearchBarStyle>
  );
};

export { SearchBar };
