import React, { useRef, useState } from "react";
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

const SearchBarStyle = styled.div`
  position: relative;
  width: 33%;
  display: flex;
  align-items: center;
  transition: 0.3s ease;

  .search-input {
    width: 100%;
    padding: 0.5em;
    border: 1px solid ${(props) => props.theme.primaryLight};
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
    background-color: ${(props) => props.theme.primaryLight};
    transition: 0.3s ease;
    color: black;
    opacity: 0.8;
    font-size: 0.8em;
    text-indent: 25px;
    outline: none;

    ::-webkit-input-placeholder {
      /* Edge */
      color: ${(props) => props.theme.dark};
    }

    :-ms-input-placeholder {
      /* Internet Explorer 10-11 */
      color: ${(props) => props.theme.dark};
    }

    ::placeholder {
      color: ${(props) => props.theme.dark};
    }

    @media only screen and (max-width: 768px) {
      width: 75%;
    }
  }

  .search-result {
    display: none;
  }

  ${({ isInputFocus }) =>
    isInputFocus &&
    css`
      width: 50%;

      .search-input {
        height: 100%;
        opacity: 1;
        font-size: 1em;

        @media only screen and (max-width: 768px) {
          width: 100%;
        }
      }

      .search-type {
        opacity: 1;
        font-size: 1em;
        padding-top: calc(0.5em - 2px);
        padding-bottom: calc(0.5em - 2px);
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
  padding-top: calc(0.5em - 1px);
  padding-bottom: calc(0.5em - 1px);
  padding-left: 0.5em;
  padding-right: 0.5em;
  background-color: ${(props) => props.theme.secondary};
  font-size: 0.8em;
  border-top-left-radius: 3px;
  border-bottom-left-radius: ${(props) => (!props.isActive ? "3px" : "none")};
  cursor: pointer;
  transition: 0.3s ease;
  min-width: 100px;
  max-width: 100px;

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
    padding-left: 1em;
    padding-right: 1em;
    padding-top: 0.5em;
    padding-bottom: 0.5em;
    min-width: 100px;
    max-width: 100px;

    .tag-icon {
      margin-right: 1em;
    }
  }
`;

const SearchResults = styled.div`
  border-left: 1px solid LightGrey;
  border-right: 1px solid LightGrey;
  border-bottom: 1px solid LightGrey;
  position: absolute;
  top: 100%;
  left: 100px;
  width: calc(100% - 99px);
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

const searchTypes = ["all", "movies", "series", "friends"];

const SearchBar = () => {
  const [isInputFocus, setIsInputFocus] = useState(false);
  const [isDropdownTypeOpen, setIsDropdownTypeOpen] = useState(false);
  const [typeSelectedIndex, setTypeSelectedIndex] = useState(0);
  const toggleDropdownButtonRef = useRef(null);
  useOutsideAlerter([toggleDropdownButtonRef], () =>
    setIsDropdownTypeOpen(false)
  );

  const [searchResult, setSearchResult] = useState(null);
  const { search } = useSearch();
  const _onInputChange = (e) => {
    const value = e.target.value;
    if (value.replace(/\s/g, "").length > 0) {
      search(searchTypes[typeSelectedIndex], value).then((res) => {
        console.log(res);
        if (res && res.length > 0) {
          setSearchResult(res);
        } else {
          setSearchResult(null);
        }
      });
    } else {
      setSearchResult(null);
    }
  };

  return (
    <SearchBarStyle isInputFocus={isInputFocus}>
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
      {searchResult && (
        <SearchResults className="search-result">
          {searchResult.map((result) => {
            if (
              searchTypes[typeSelectedIndex] === "movies" ||
              searchTypes[typeSelectedIndex] === "series" ||
              searchTypes[typeSelectedIndex] === "all"
            ) {
              return <MediaResult key={result.id} media={result} />;
            } else {
              return <div />;
            }
          })}
        </SearchResults>
      )}
    </SearchBarStyle>
  );
};

export { SearchBar };
