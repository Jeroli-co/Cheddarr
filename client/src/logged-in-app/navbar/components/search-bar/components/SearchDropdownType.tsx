import React, { useRef, useState, MouseEvent } from "react";
import styled from "styled-components";
import { useOutsideAlerter } from "../../../../../shared/hooks/useOutsideAlerter";
import { SearchRequestTypes } from "../../../../enums/SearchRequestTypes";
import { uppercaseFirstLetter } from "../../../../../utils/strings";
import { STATIC_STYLES } from "../../../../../shared/enums/StaticStyles";

const Container = styled.div<{ isActive: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: ${(props) => props.theme.primaryLight};
  cursor: pointer;
  transition: 0.3s ease;
  height: 100%;
  min-width: 100px;
  max-width: 100px;

  @media screen and (min-width: ${STATIC_STYLES.MOBILE_MAX_WIDTH}px) {
    border-top-left-radius: 3px;
    border-bottom-left-radius: ${(props) => (!props.isActive ? "3px" : "none")};
  }
`;

const ActiveItem = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const Items = styled.div`
  position: absolute;
  top: 100%;
  background-color: ${(props) => props.theme.primaryLight};
  width: 100%;

  @media screen and (min-width: ${STATIC_STYLES.MOBILE_MAX_WIDTH}px) {
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
  }
`;

const Item = styled.div`
  width: 100%;
  padding: 5px 15px;
  display: flex;
  justify-content: center;

  &:hover {
    background: ${(props) => props.theme.secondary};
  }

  &:last-child {
    border-radius: 0 0 3px 3px;
  }
`;

type DropdownTypeProps = {
  selectedOption: SearchRequestTypes;
  onChange: (type: SearchRequestTypes) => void;
};

const SearchDropdownType = ({
  selectedOption,
  onChange,
}: DropdownTypeProps) => {
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
    <Container ref={dropdownRef} isActive={isOpen} onClick={onDropdownClick}>
      <ActiveItem>{uppercaseFirstLetter(selectedOption)}</ActiveItem>
      <Items>
        {isOpen &&
          Object.values(SearchRequestTypes).map(
            (st, index) =>
              st !== selectedOption && (
                <Item key={index} onClick={(e) => onOptionClick(e, st)}>
                  {uppercaseFirstLetter(st)}
                </Item>
              )
          )}
      </Items>
    </Container>
  );
};

export { SearchDropdownType };
