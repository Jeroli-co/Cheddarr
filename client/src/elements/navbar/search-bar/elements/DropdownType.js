import React, { useRef, useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faAngleUp,
  faTag,
  faTags,
} from "@fortawesome/free-solid-svg-icons";
import { useOutsideAlerter } from "../../../../hooks/useOutsideAlerter";
import { SEARCH_TYPES } from "../../../../enums/SearchTypes";

const DropdownTypeStyle = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${(props) => props.theme.secondary};
  border-top-left-radius: 3px;
  border-bottom-left-radius: ${(props) => (!props.isActive ? "3px" : "none")};
  cursor: pointer;
  transition: 0.3s ease;
  height: 100%;

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

const DropdownType = ({ selectedOption, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  useOutsideAlerter([dropdownRef], () => setIsOpen(false));

  const _onChange = (value) => {
    setIsOpen(false);
    onChange(value);
  };

  return (
    <DropdownTypeStyle ref={dropdownRef}>
      <div className="search-types-item" onClick={() => setIsOpen(!isOpen)}>
        <FontAwesomeIcon icon={faTags} />
        {selectedOption}
        {!isOpen && <FontAwesomeIcon icon={faAngleUp} />}
        {isOpen && <FontAwesomeIcon icon={faAngleDown} />}
      </div>
      <div className="search-types-items">
        {isOpen &&
          Object.values(SEARCH_TYPES).map(
            (st, index) =>
              st !== selectedOption && (
                <div
                  key={index}
                  className="search-types-item"
                  onClick={() => _onChange(st)}
                >
                  <FontAwesomeIcon className="tag-icon" icon={faTag} />
                  {st}
                </div>
              )
          )}
      </div>
    </DropdownTypeStyle>
  );
};

export { DropdownType };
