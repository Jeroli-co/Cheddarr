import React, { useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import { useOutsideAlerter } from "../../../../hooks/useOutsideAlerter";
import { useSearch } from "../../../../hooks/useSearch";
import { isEmpty } from "../../../../utils/strings";
import { DropdownType } from "./elements/DropdownType";
import { ResultsList } from "./elements/ResultsList";

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
    height: 60%;
    padding: 0.5em;
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

const searchTypes = ["all", "movies", "series", "friends"];
let timer = null;

const SearchBar = () => {
  const [searchType, setSearchType] = useState(searchTypes[0]);
  const [isInputFocus, setIsInputFocus] = useState(false);
  const [value, setValue] = useState("");
  const [results, setResults] = useState({
    value: [],
    loading: false,
    visible: false,
  });

  const searchBarRef = useRef(null);
  useOutsideAlerter([searchBarRef], () =>
    setResults({ ...results, visible: false })
  );

  const { search } = useSearch();

  const _onInputChange = (e) => {
    setValue(e.target.value);
  };

  const _search = () => {
    if (!isEmpty(value) && value.length > 1) {
      setResults({ ...results, loading: true, visible: true });
    } else {
      setResults({ value: [], loading: false, visible: false });
    }
  };

  useEffect(() => {
    clearTimeout(timer);
    timer = setTimeout(() => _search(), 750);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    if (results.loading) {
      search(searchType, value).then((data) => {
        if (data) {
          setResults({ ...results, value: data, loading: false });
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
    <SearchBarStyle ref={searchBarRef} isInputFocus={isInputFocus}>
      <DropdownType
        options={searchTypes}
        selectedOption={searchType}
        onChange={(type) => setSearchType(type)}
      />
      <input
        onChange={(e) => _onInputChange(e)}
        onFocus={() => {
          setIsInputFocus(true);
          setResults({ ...results, visible: results.value.length > 0 });
        }}
        onBlur={() => setIsInputFocus(false)}
        className="search-input"
        type="text"
        placeholder="Search..."
      />
      <ResultsList
        isVisible={results.visible}
        isLoading={results.loading}
        searchType={searchType}
        results={results.value}
      />
    </SearchBarStyle>
  );
};

export { SearchBar };
