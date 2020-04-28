import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";

const SearchBarStyle = styled.div``;

const SearchBar = () => {
  return (
    <SearchBarStyle className="field has-addons has-addons-right">
      <div className="control">
        <span className="select">
          <select>
            <option>#Movies</option>
            <option>#Series</option>
            <option>#Request</option>
          </select>
        </span>
      </div>
      <div className="control has-icons-left is-expanded">
        <input className="input is-rounded" type="text" placeholder="Search" />
        <span className="icon is-small is-left">
          <FontAwesomeIcon icon={faSearch} />
        </span>
      </div>
      <div className="control">
        <button className="button is-info">Search</button>
      </div>
    </SearchBarStyle>
  );
};

export { SearchBar };
