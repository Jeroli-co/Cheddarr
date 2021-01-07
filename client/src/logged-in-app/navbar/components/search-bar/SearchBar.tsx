import React, {
  ChangeEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import styled, { css } from "styled-components";
import { isEmpty } from "../../../../utils/strings";
import { DropdownType } from "./components/DropdownType";
import { ResultsList } from "./components/ResultsList";
import { useHistory } from "react-router";
import { routes } from "../../../../routes";
import { SearchRequestTypes } from "../../../enums/SearchRequestTypes";
import { IPublicUser } from "../../../models/IPublicUser";
import { usePlexConfig } from "../../../contexts/PlexConfigContext";
import { IMediaSearchResult } from "./models/IMediaSearchResult";
import { IAsyncData } from "../../../../shared/models/IAsyncData";
import { useAPI } from "../../../../shared/hooks/useAPI";
import { APIRoutes } from "../../../../shared/enums/APIRoutes";
import { STATIC_STYLES } from "../../../../shared/enums/StaticStyles";

const SearchBarStyle = styled.div<{ isInputFocus: boolean }>`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  transition: 0.3s ease;

  @media only screen and (min-width: 1024px) {
    width: 40%;
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
      color: ${STATIC_STYLES.COLORS.DARK};
    }
  }

  ${({ isInputFocus }) =>
    isInputFocus &&
    css`
      @media only screen and (min-width: 1024px) {
        width: 60%;
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
    if (currentConfig.data) {
      if (moviesResults.isLoading) {
        get<IMediaSearchResult[]>(
          APIRoutes.SEARCH_PLEX_MOVIES(currentConfig.data.id, value)
        ).then((res) => {
          if (res.status === 200 && res.data) {
            setMoviesResults({ data: res.data, isLoading: false });
          }
        });
      }

      if (seriesResults.isLoading) {
        get<IMediaSearchResult[]>(
          APIRoutes.SEARCH_PLEX_SERIES(currentConfig.data.id, value)
        ).then((res) => {
          if (res.status === 200 && res.data) {
            setSeriesResults({ data: res.data, isLoading: false });
          }
        });
      }
    }

    if (friendsResults.isLoading) {
      get<IPublicUser[]>(APIRoutes.SEARCH_FRIENDS(value)).then((res) => {
        if (res.status === 200 && res.data) {
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
