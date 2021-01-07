import React, { useRef, useState, MouseEvent } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faAngleUp,
  faTag,
  faTags,
} from "@fortawesome/free-solid-svg-icons";
import { useOutsideAlerter } from "../../../../../shared/hooks/useOutsideAlerter";
import { SearchRequestTypes } from "../../../../enums/SearchRequestTypes";
import { STATIC_STYLES } from "../../../../../shared/enums/StaticStyles";

const DropdownTypeStyle = styled.div<{ isActive: boolean }>`
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
      border-top: 1px solid ${STATIC_STYLES.COLORS.DARK};
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

type DropdownTypeProps = {
  selectedOption: SearchRequestTypes;
  onChange: (type: SearchRequestTypes) => void;
};

const DropdownType = ({ selectedOption, onChange }: DropdownTypeProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  useOutsideAlerter([dropdownRef], () => setIsOpen(false));

  const onDropdownClick = (e: MouseEvent) => {
    setIsOpen(!isOpen);
    e.preventDefault();
  };

  const onOptionClick = (e: MouseEvent, value: SearchRequestTypes) => {
    setIsOpen(false);
    onChange(value);
    e.preventDefault();
  };

  return (
    <DropdownTypeStyle
      ref={dropdownRef}
      isActive={isOpen}
      onClick={onDropdownClick}
    >
      <div className="search-types-item">
        <FontAwesomeIcon icon={faTags} />
        {selectedOption}
        {!isOpen && <FontAwesomeIcon icon={faAngleUp} />}
        {isOpen && <FontAwesomeIcon icon={faAngleDown} />}
      </div>
      <div className="search-types-items">
        {isOpen &&
          Object.values(SearchRequestTypes).map(
            (st, index) =>
              st !== selectedOption && (
                <div
                  key={index}
                  className="search-types-item"
                  onClick={(e) => onOptionClick(e, st)}
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
