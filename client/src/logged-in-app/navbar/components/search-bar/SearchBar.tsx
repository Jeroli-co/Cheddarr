import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import { SearchDropdownType } from "./SearchDropdownType";
import { useNavigate } from "react-router";
import { routes } from "../../../../router/routes";
import { SearchFilters } from "../../../../shared/enums/SearchFilters";
import { STATIC_STYLES } from "../../../../shared/enums/StaticStyles";
import { isEmpty } from "../../../../utils/strings";
import { useLocation } from "react-router-dom";

const Container = styled.div<{
  isInputFocus: boolean;
}>`
  @media screen and (max-width: ${STATIC_STYLES.TABLET_MAX_WIDTH}px) {
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
      color: ${(props) => props.theme.white};

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
  }

  @media screen and (min-width: ${STATIC_STYLES.TABLET_MAX_WIDTH}px) {
    position: absolute;
    left: ${STATIC_STYLES.SIDEBAR_OPEN_WIDTH + 10}px;
    right: ${STATIC_STYLES.SIDEBAR_OPEN_WIDTH + 10}px;
    display: flex;
    align-items: center;
    transition: 0.3s ease;
    height: ${STATIC_STYLES.SEARCH_BAR_HEIGHT}px;
    user-select: none;

    .search-input {
      width: 50%;
      height: 100%;
      border: 1px solid rgba(0, 0, 0, 0);
      border-top-right-radius: 3px;
      border-bottom-right-radius: 3px;
      background-color: ${(props) => props.theme.primaryLight};
      transition: width 0.5s ease;
      color: ${(props) => props.theme.white};
      opacity: 0.5;
      text-indent: 25px;
      outline: none;

      ::placeholder {
        color: ${(props) => props.theme.white};
      }
    }

    ${({ isInputFocus }) =>
      isInputFocus &&
      css`
        .search-input {
          opacity: 1;
          width: 100%;
        }
      `}
  }
`;

export const SearchBar = () => {
  const [isInputFocus, setIsInputFocus] = useState(false);
  const [searchType, setSearchType] = useState<SearchFilters>(
    SearchFilters.ALL
  );
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const onSearchTypeChange = (type: SearchFilters) => {
    setSearchType(type);
    if (inputRef && inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    if (!isEmpty(searchValue)) {
      navigate(routes.SEARCH.url(searchType, searchValue));
    } else if (
      location.pathname.startsWith("/search") &&
      isEmpty(searchValue)
    ) {
      navigate(routes.HOME.url);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchType, searchValue]);

  return (
    <Container isInputFocus={isInputFocus}>
      <SearchDropdownType
        selectedOption={searchType}
        onChange={onSearchTypeChange}
      />
      <input
        ref={inputRef}
        value={searchValue}
        onChange={onInputChange}
        onFocus={() => setIsInputFocus(true)}
        onBlur={() => setIsInputFocus(false)}
        className="search-input"
        type="text"
        placeholder="Search..."
      />
    </Container>
  );
};
