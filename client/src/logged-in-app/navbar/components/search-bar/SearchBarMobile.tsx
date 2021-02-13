import React, {
  ChangeEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import styled, { css } from "styled-components";
import { isEmpty } from "../../../../utils/strings";
import { SearchDropdownType } from "./components/SearchDropdownType";
import { ResultsList } from "./components/ResultsList";
import { useHistory } from "react-router";
import { routes } from "../../../../router/routes";
import { SearchFilters } from "../../../../shared/enums/SearchFilters";
import { IPublicUser } from "../../../../shared/models/IPublicUser";
import { usePlexConfig } from "../../../../shared/contexts/PlexConfigContext";
import { IMediaSearchResult } from "../../../../shared/models/IMediaSearchResult";
import { IAsyncData } from "../../../../shared/models/IAsyncData";
import { useAPI } from "../../../../shared/hooks/useAPI";
import { APIRoutes } from "../../../../shared/enums/APIRoutes";
import { STATIC_STYLES } from "../../../../shared/enums/StaticStyles";

const Container = styled.div<{
  isInputFocus: boolean;
}>`
  display: flex;
  align-items: center;
  transition: 0.3s ease;
  height: ${STATIC_STYLES.SEARCH_BAR_HEIGHT}px;
  width: 100%;
  background: ${(props) => props.theme.primaryLighter};

  .search-input {
    width: 100%;
    height: 100%;
    border: 1px solid rgba(0, 0, 0, 0);
    background-color: ${(props) => props.theme.primaryLight};
    color: black;
    opacity: 0.5;
    transition: opacity 0.5s ease;

    text-indent: 25px;
    outline: none;
    border-radius: 0;

    ::placeholder {
      color: ${(props) => props.theme.white};
    }
  }

  ${({ isInputFocus }) =>
    isInputFocus &&
    css`
      .search-input {
        opacity: 1;
      }
    `}
`;

let timer: any;

export const SearchBarMobile = () => {
  const [searchType, setSearchType] = useState<SearchFilters>(
    SearchFilters.ALL
  );
  const [isInputFocus, setIsInputFocus] = useState(false);
  const [value, setValue] = useState("");

  const initialSearchState = { data: null, isLoading: false };
  const [moviesResults, setMoviesResults] = useState<
    IAsyncData<IMediaSearchResult[] | null>
  >(initialSearchState);
  const [seriesResults, setSeriesResults] = useState<
    IAsyncData<IMediaSearchResult[] | null>
  >(initialSearchState);
  const [friendsResults, setFriendsResults] = useState<
    IAsyncData<IPublicUser[] | null>
  >(initialSearchState);

  const { currentConfig } = usePlexConfig();
  const { get } = useAPI();

  const history = useHistory();
  const inputRef = useRef<HTMLInputElement>(null);

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    e.preventDefault();
  };

  const onKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && value.length > 0) {
      history.push(routes.SEARCH.url(searchType, value));
      setValue("");
    }
  };

  const onSearchTypeChange = (type: SearchFilters) => {
    if (inputRef && inputRef.current) {
      setSearchType(type);
      inputRef.current.focus();
    }
  };

  const _search = () => {
    if (!isEmpty(value) && value.length > 1) {
      switch (searchType) {
        case SearchFilters.MOVIES:
          setMoviesResults({ ...moviesResults, isLoading: true });
          break;
        case SearchFilters.SERIES:
          setSeriesResults({ ...seriesResults, isLoading: true });
          break;
        case SearchFilters.FRIENDS:
          setFriendsResults({ ...friendsResults, isLoading: true });
          break;
        case SearchFilters.ALL:
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
    if (currentConfig.data) {
      if (moviesResults.isLoading) {
        get<IMediaSearchResult[]>(
          APIRoutes.SEARCH_PLEX_MOVIES(currentConfig.data.id, value)
        ).then((res) => {
          if (res.status === 200 && res.data) {
            setMoviesResults({ data: res.data, isLoading: false });
          } else {
            setMoviesResults({ ...moviesResults, isLoading: false });
          }
        });
      }

      if (seriesResults.isLoading) {
        get<IMediaSearchResult[]>(
          APIRoutes.SEARCH_PLEX_SERIES(currentConfig.data.id, value)
        ).then((res) => {
          if (res.status === 200 && res.data) {
            setSeriesResults({ data: res.data, isLoading: false });
          } else {
            setSeriesResults({ ...seriesResults, isLoading: false });
          }
        });
      }
    } else {
      setSeriesResults({ ...seriesResults, isLoading: false });
      setMoviesResults({ ...moviesResults, isLoading: false });
    }

    if (friendsResults.isLoading) {
      get<IPublicUser[]>(APIRoutes.SEARCH_FRIENDS(value)).then((res) => {
        if (res.status === 200 && res.data) {
          setFriendsResults({ data: res.data, isLoading: false });
        } else {
          setFriendsResults({ ...friendsResults, isLoading: false });
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
    <Container isInputFocus={isInputFocus}>
      <SearchDropdownType
        selectedOption={searchType}
        onChange={onSearchTypeChange}
      />

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
    </Container>
  );
};
