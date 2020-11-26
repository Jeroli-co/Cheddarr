import React, {
  ChangeEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import styled, { css } from "styled-components";
import { isEmpty } from "../../../utils/strings";
import { DropdownType } from "./elements/DropdownType";
import { ResultsList } from "./elements/ResultsList";
import { useHistory } from "react-router";
import { routes } from "../../../router/routes";
import { SearchRequestTypes } from "../../search/enums/SearchRequestTypes";
import { SearchService } from "../../search/services/SearchService";

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

  const initialResult = { data: null, loading: false };
  const [results, setResults] = useState<{
    data: any | null;
    loading: boolean;
  }>(initialResult);

  const history = useHistory();
  const inputRef = useRef<HTMLInputElement>(null);

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    e.preventDefault();
  };

  const onSearchTypeChange = (type: SearchRequestTypes) => {
    if (inputRef && inputRef.current) {
      setSearchType(type);
      inputRef.current.focus();
    }
  };

  const onKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && value.length > 0) {
      history.push(routes.SEARCH.url(searchType, value));
      setValue("");
    }
    e.preventDefault();
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
      SearchService.getMediasByTitle(searchType, value).then((data) => {
        if (data) {
          setResults({ data: data, loading: false });
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
        isVisible={isInputFocus}
        searchType={searchType}
        results={results}
      />
    </SearchBarStyle>
  );
};

export { SearchBar };
