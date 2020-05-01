import React, { useEffect, useReducer, useRef, useState } from "react";
import styled, { css } from "styled-components";
import {
  faAngleDown,
  faAngleRight,
  faTag,
  faTags,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useOutsideAlerter } from "../../../hooks/useOutsideAlerter";
import { useSearch } from "../../../hooks/useSearch";
import { RowLayout } from "../../layouts";
import { isEmpty } from "../../../utils/strings";
import { Spinner } from "../../Spinner";

const SearchBarStyle = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  transition: 0.3s ease;

  @media only screen and (min-width: 1024px) {
    width: 33%;
  }

  .search-input {
    width: 100%;
    height: 50%;
    padding: 0.5em;
    border: 1px solid ${(props) => props.theme.primaryLight};
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
    background-color: ${(props) => props.theme.primaryLight};
    transition: 0.3s ease;
    color: black;
    opacity: 0.8;
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
        width: 50%;
      }

      .search-input {
        opacity: 1;

        @media only screen and (max-width: 768px) {
          width: 100%;
        }
      }

      .search-type {
        opacity: 1;
      }
    `}
`;

const SearchTypesStyle = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${(props) => props.theme.secondary};
  border-top-left-radius: 3px;
  border-bottom-left-radius: ${(props) => (!props.isActive ? "3px" : "none")};
  cursor: pointer;
  transition: 0.3s ease;
  min-width: 120px;
  max-width: 120px;
  height: 50%;

  .search-types-items {
    position: absolute;
    top: 100%;
    left: 0;
    background-color: ${(props) => props.theme.secondary};
    border-bottom-right-radius: 3px;
    border-bottom-left-radius: 3px;
    z-index: 2;
    > * {
      border-top: 1px solid ${(props) => props.theme.dark};
    }
  }

  .search-types-item {
    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 0.5em;
    min-width: 120px;
    max-width: 120px;
  }
`;

const SearchResults = styled.div`
  border-left: 1px solid LightGrey;
  border-right: 1px solid LightGrey;
  border-bottom: 1px solid LightGrey;
  position: absolute;
  top: 75%;
  left: 120px;
  width: calc(100% - 120px);
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
  background: white;
  z-index: 1;
`;

const MediaResult = ({ media }) => {
  return (
    <RowLayout
      justifyContent="space-between"
      borderTop="1px solid LightGrey"
      padding="1%"
    >
      <img src={media.thumbUrl} alt="Movie" width="50" height="70" />
      <p>{media.title}</p>
    </RowLayout>
  );
};

const FriendResult = ({ user }) => {
  return (
    <RowLayout
      justifyContent="space-between"
      borderTop="1px solid LightGrey"
      padding="1%"
    >
      <img src={user["user_picture"]} alt="Movie" width="50" height="70" />
      <p>@{user.username}</p>
      <p>{user.email}</p>
    </RowLayout>
  );
};

const SearchResultsItems = ({ type, results }) => {
  if (type === "all") {
    const sortedResult = sortSearchResult(results);
    return (
      <div>
        {sortedResult.friends.length > 0 && (
          <div>
            <div>Friends</div>
            {sortedResult.friends.map((friend, index) => (
              <FriendResult key={index} user={friend} />
            ))}
          </div>
        )}
        {sortedResult.movies.length > 0 && (
          <div>
            <div>Movies</div>
            {sortedResult.movies.map((movie, index) => (
              <MediaResult key={index} media={movie} />
            ))}
          </div>
        )}
        {sortedResult.series.length > 0 && (
          <div>
            <div>Series</div>
            {sortedResult.series.map((series, index) => (
              <MediaResult key={index} media={series} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return results.map((result, index) => {
    if (type === "movies" || type === "series") {
      return <MediaResult key={index} media={result} />;
    } else if (type === "friends") {
      return <FriendResult key={index} />;
    } else {
      return <div />;
    }
  });
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

const searchTypes = ["all", "movies", "series", "friends"];
let timer = null;

const initialState = {
  inputFocus: false,
  typesOpen: false,
  type: "all",
  searchValue: "",
  resultsShow: false,
  results: [],
  isSearchLoading: false,
};

const initReducer = () => initialState;

const actionTypes = {
  LEAVE_FOCUS: "leave-focus",
  FOCUS_INPUT: "focus-input",
  TOGGLE_TYPES: "toggle-types",
  CLOSE_TYPES: "close-types",
  SELECT_TYPES: "select-type",
  UPDATE_VALUE: "update-value",
  UPDATE_RESULT: "update-results",
  LOAD_SEARCH: "load-search",
};

const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.LEAVE_FOCUS:
      return {
        ...state,
        inputFocus: false,
        typesOpen: false,
        resultsShow: false,
      };
    case actionTypes.FOCUS_INPUT:
      return {
        ...state,
        typesOpen: false,
        resultsShow: true,
        inputFocus: true,
      };
    case actionTypes.TOGGLE_TYPES:
      return { ...state, typesOpen: !state.typesOpen };
    case actionTypes.CLOSE_TYPES:
      return { ...state, typesOpen: false };
    case actionTypes.SELECT_TYPES:
      return { ...state, typesOpen: false, type: action.payload.type };
    case actionTypes.UPDATE_VALUE:
      return { ...state, searchValue: action.payload.searchValue };
    case actionTypes.UPDATE_RESULT:
      return {
        ...state,
        isSearchLoading: false,
        results: action.payload.results,
      };
    case actionTypes.LOAD_SEARCH:
      return { ...state, isSearchLoading: true, resultsShow: true };
    default:
      throw new Error("No types matched");
  }
};

const SearchBar = () => {
  const [state, dispatch] = useReducer(reducer, initialState, initReducer);

  const searchBarRef = useRef(null);
  const typesDropdownRef = useRef(null);
  // click outside this component
  useOutsideAlerter([searchBarRef], () => {
    dispatch({ type: actionTypes.LEAVE_FOCUS });
  });
  // Click outside dropdown type
  useOutsideAlerter([typesDropdownRef], () => {
    dispatch({ type: actionTypes.CLOSE_TYPES });
  });

  const { search } = useSearch();

  const _search = () => {
    if (!isEmpty(state.searchValue)) {
      dispatch({ type: actionTypes.LOAD_SEARCH });
    }
  };

  const _onInputChange = (e) => {
    const value = e.target.value;
    dispatch({
      type: actionTypes.UPDATE_VALUE,
      payload: { searchValue: value },
    });
  };

  useEffect(() => {
    clearTimeout(timer);
    timer = setTimeout(() => _search(), 750);
  }, [state.searchValue]);

  useEffect(() => {
    if (state.isSearchLoading) {
      search(state.type, state.searchValue).then((data) => {
        console.log(data);
        if (data) {
          dispatch({
            type: actionTypes.UPDATE_RESULT,
            payload: { results: data },
          });
        }
      });
    }
  }, [state.isSearchLoading]);

  useEffect(() => {
    if (state.resultsShow) {
      _search();
    }
  }, [state.type]);

  return (
    <SearchBarStyle ref={searchBarRef} isInputFocus={state.inputFocus}>
      <SearchTypesStyle
        ref={typesDropdownRef}
        className="search-type"
        isActive={state.typesOpen}
      >
        <div
          className="search-types-item"
          onClick={() => dispatch({ type: actionTypes.TOGGLE_TYPES })}
        >
          <FontAwesomeIcon icon={faTags} />
          {state.type}
          {!state.typesOpen && <FontAwesomeIcon icon={faAngleRight} />}
          {state.typesOpen && <FontAwesomeIcon icon={faAngleDown} />}
        </div>
        <div className="search-types-items">
          {state.typesOpen &&
            searchTypes.map(
              (st, index) =>
                st !== state.type && (
                  <div
                    key={index}
                    className="search-types-item"
                    onClick={() =>
                      dispatch({
                        type: actionTypes.SELECT_TYPES,
                        payload: { type: st },
                      })
                    }
                  >
                    <FontAwesomeIcon className="tag-icon" icon={faTag} />
                    {st}
                  </div>
                )
            )}
        </div>
      </SearchTypesStyle>
      <input
        onChange={(e) => _onInputChange(e)}
        onFocus={() => dispatch({ type: actionTypes.FOCUS_INPUT })}
        className="search-input"
        type="text"
        placeholder="Search..."
      />
      {state.resultsShow && (
        <SearchResults className="search-result">
          {!state.isSearchLoading && (
            <SearchResultsItems type={state.type} results={state.results} />
          )}
          {state.isSearchLoading && (
            <Spinner
              justifyContent="center"
              color="primary"
              size="2x"
              padding="1em"
            />
          )}
        </SearchResults>
      )}
    </SearchBarStyle>
  );
};

export { SearchBar };
