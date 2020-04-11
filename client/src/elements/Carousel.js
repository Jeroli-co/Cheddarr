import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleLeft, faAngleRight} from "@fortawesome/free-solid-svg-icons";

const CarouselStyled = styled.div`
  position: relative;
`

const CarouselItemsStyled = styled.ul`
  display: flex;
  overflow-x: scroll;
  scroll-behavior: smooth;

  ::-webkit-scrollbar {
    display: none;
  }
`;

const CarouselItemStyled = styled.li`
  flex-grow: 1;
  flex-shrink: 0;
`;

const CarouselButtons = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
`;

const LeftScrollButton = styled.button`
  position: sticky;
  left: 0;
  top: 0;
  width: 60px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  color: SlateGray;
  background: transparent;
  opacity: .5;
  transition: .6s ease;
  z-index: 1;

  &:hover {
    opacity: 1;
    color: white;
    background: rgba(0,0,0,.5);
  }
`;

const RightScrollButton = styled.button`
  position: sticky;
  right: 0;
  top: 0;
  width: 60px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  color: SlateGray;
  background: transparent;
  opacity: .5;
  z-index: 1;
  transition: .6s ease;

  &:hover {
    opacity: 1;
    color: white;
    background: rgba(0,0,0,.5);
  }
`;

const Carousel = ({ children }) => {

  const carouselItemsRefs = [];
  children.forEach(() => {
    carouselItemsRefs.push(React.createRef());
  });

  return (
    <CarouselStyled>

      <CarouselButtons>

        <LeftScrollButton>
          <span className="icon">
            <FontAwesomeIcon icon={faAngleLeft} size="6x"/>
          </span>
        </LeftScrollButton>

        <RightScrollButton>
          <span className="icon">
            <FontAwesomeIcon icon={faAngleRight} size="6x"/>
          </span>
        </RightScrollButton>

      </CarouselButtons>

      <CarouselItemsStyled>
        { children.map((child, index) => <CarouselItemStyled key={index} ref={carouselItemsRefs[index]} >{child}</CarouselItemStyled>) }
      </CarouselItemsStyled>

    </CarouselStyled>
  );
};

export {
  Carousel
}
