import React, { useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import { useSearch } from "../../search/hooks/useSearch";
import { isEmpty } from "../../../utils/strings";
import { DropdownType } from "./elements/DropdownType";
import { ResultsList } from "./elements/ResultsList";
import { useHistory } from "react-router";
import { routes } from "../../../router/routes";
import { SEARCH_TYPES } from "../../search/enums/SearchTypes";

const SearchBarStyle = styled.div`
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

let timer = null;

const SearchBar = () => {
  const [searchType, setSearchType] = useState(SEARCH_TYPES.ALL);
  const [isInputFocus, setIsInputFocus] = useState(false);
  const [value, setValue] = useState("");

  const initialResult = {
    value: null,
    loading: false,
  };
  const [results, setResults] = useState(initialResult);

  const history = useHistory();
  const { search } = useSearch();
  const inputRef = useRef(null);

  const _onInputChange = (e) => {
    setValue(e.target.value);
  };

  const _onSearchTypeChange = (type) => {
    setSearchType(type);
    inputRef.current.focus();
  };

  const _onKeyPress = (e) => {
    if (e.key === "Enter" && value.length > 0) {
      history.push(routes.SEARCH.url(searchType, value));
      setValue("");
      e.preventDefault();
    }
  };

  const _search = () => {
    if (!isEmpty(value) && value.length > 1) {
      setResults({ ...results, loading: true });
    } else {
      setResults(initialResult);
    }
  };

  useEffect(() => {
    clearTimeout(timer);
    timer = setTimeout(() => _search(), 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    if (results.loading) {
      search(searchType, value).then((data) => {
        if (data) {
          setResults({ value: data, loading: false });
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results.loading]);

  useEffect(() => {
    _search();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchType]);

  return (
    <SearchBarStyle isInputFocus={isInputFocus}>
      <DropdownType
        selectedOption={searchType}
        onChange={(type) => _onSearchTypeChange(type)}
      />
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => _onInputChange(e)}
        onFocus={() => setIsInputFocus(true)}
        onBlur={() => setIsInputFocus(false)}
        onKeyPress={(e) => _onKeyPress(e)}
        className="search-input"
        type="text"
        placeholder="Search..."
      />
      <ResultsList
        searchValue={value}
        isVisible={isInputFocus}
        searchType={searchType}
        results={results}
      />
    </SearchBarStyle>
  );
};

export { SearchBar };
