import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import { SearchDropdownType } from "./components/SearchDropdownType";
import { useHistory } from "react-router";
import { routes } from "../../../../router/routes";
import { SearchRequestTypes } from "../../../enums/SearchRequestTypes";
import { STATIC_STYLES } from "../../../../shared/enums/StaticStyles";
import { isEmpty } from "../../../../utils/strings";

const Container = styled.div<{
  isInputFocus: boolean;
  isSidebarOpen: boolean;
}>`
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
`;

let timer: any;

type SearchBarProps = {
  isSidebarOpen: boolean;
};

export const SearchBar2 = ({ isSidebarOpen }: SearchBarProps) => {
  const [isInputFocus, setIsInputFocus] = useState(false);
  const [searchType, setSearchType] = useState<SearchRequestTypes>(
    SearchRequestTypes.ALL
  );
  const [searchValue, setSearchValue] = useState("");
  const history = useHistory();
  const inputRef = useRef<HTMLInputElement>(null);

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const onSearchTypeChange = (type: SearchRequestTypes) => {
    setSearchType(type);
    if (inputRef && inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    if (!isEmpty(searchValue)) {
      history.push(routes.SEARCH.url(searchType, searchValue));
    }
  }, [searchType, searchValue]);

  return (
    <Container isInputFocus={isInputFocus} isSidebarOpen={isSidebarOpen}>
      <SearchDropdownType
        selectedOption={searchType}
        onChange={onSearchTypeChange}
      />
      <input
        ref={inputRef}
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
