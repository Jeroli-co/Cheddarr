import React, { useEffect, useRef, useState } from "react";
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

  .search-result {
    display: none;
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

      .search-result {
        display: block;
      }
    `}
`;

const SearchTypesStyle = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5em;
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

const searchTypes = ["all", "movies", "series", "friends"];
let timer = null;

const SearchBar = () => {
  const [isInputFocus, setIsInputFocus] = useState(false);
  const [isDropdownTypeOpen, setIsDropdownTypeOpen] = useState(false);
  const [typeSelectedIndex, setTypeSelectedIndex] = useState(0);
  const searchBarRef = useRef(null);
  const toggleDropdownButtonRef = useRef(null);
  const [inputValue, setInputValue] = useState("");
  // click outside this component
  useOutsideAlerter([searchBarRef], () => setIsDropdownTypeOpen(false));
  // Click outside dropdown type
  useOutsideAlerter([toggleDropdownButtonRef], () =>
    setIsDropdownTypeOpen(false)
  );

  const [searchResult, setSearchResult] = useState(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const { search } = useSearch();

  const _search = (value) => {
    if (!isEmpty(value)) {
      setIsSearchLoading(true);
      search(searchTypes[typeSelectedIndex], value)
        .then((res) => {
          console.log(res);
          if (res && res.length > 0) {
            setSearchResult(res);
          } else {
            setSearchResult(null);
          }
        })
        .finally(() => setIsSearchLoading(false));
    } else {
      setSearchResult(null);
    }
  };

  const _onInputChange = (e) => {
    clearTimeout(timer);
    const value = e.target.value;
    setInputValue(value);
    timer = setTimeout(() => _search(value), 750);
  };

  useEffect(() => {
    _search(inputValue);
  }, [typeSelectedIndex]);

  return (
    <SearchBarStyle ref={searchBarRef} isInputFocus={isInputFocus}>
      <SearchTypesStyle
        ref={toggleDropdownButtonRef}
        className="search-type"
        onClick={() => setIsDropdownTypeOpen(!isDropdownTypeOpen)}
        isActive={isDropdownTypeOpen}
      >
        <FontAwesomeIcon icon={faTags} />
        <div className="search-types-selected-item">
          {searchTypes[typeSelectedIndex]}
        </div>
        <div className="search-types-items">
          {isDropdownTypeOpen &&
            searchTypes.map(
              (st, index) =>
                index !== typeSelectedIndex && (
                  <div
                    key={index}
                    className="search-types-item"
                    onClick={() => setTypeSelectedIndex(index)}
                  >
                    <FontAwesomeIcon className="tag-icon" icon={faTag} />
                    {st}
                  </div>
                )
            )}
        </div>
        {!isDropdownTypeOpen && <FontAwesomeIcon icon={faAngleRight} />}
        {isDropdownTypeOpen && <FontAwesomeIcon icon={faAngleDown} />}
      </SearchTypesStyle>
      <input
        onChange={(e) => _onInputChange(e)}
        onFocus={() => setIsInputFocus(true)}
        onBlur={() => setIsInputFocus(false)}
        className="search-input"
        type="text"
        placeholder="Search..."
      />
      <SearchResults className="search-result">
        {searchResult &&
          !isSearchLoading &&
          searchResult.map((result, index) => {
            if (
              searchTypes[typeSelectedIndex] === "movies" ||
              searchTypes[typeSelectedIndex] === "series" ||
              searchTypes[typeSelectedIndex] === "all"
            ) {
              return <MediaResult key={index} media={result} />;
            } else if (searchTypes[typeSelectedIndex] === "friends") {
              return <FriendResult key={index} />;
            } else {
              return <div />;
            }
          })}
        {isSearchLoading && (
          <Spinner
            justifyContent="center"
            color="primary"
            size="2x"
            padding="1em"
          />
        )}
      </SearchResults>
    </SearchBarStyle>
  );
};

export { SearchBar };
