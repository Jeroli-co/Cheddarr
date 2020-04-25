import React, { useRef } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import smoothscroll from "smoothscroll-polyfill";

const CarouselStyle = styled.div`
  position: relative;
  max-width: 100%;
`;

const CarouselItems = styled.div`
  display: flex;
  overflow-x: scroll;
  scroll-behavior: smooth;

  -ms-overflow-style: none; /* IE 11 */
  scrollbar-width: none; /* Firefox 64 */
  ::-webkit-scrollbar {
    display: none;
  }
`;

const PaginationTabs = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
`;

const PaginationButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1em;
  border: 1px solid transparent;
  background: transparent;
  color: SlateGray;
  opacity: 0.5;
  transition: 0.6s ease;

  &:hover {
    color: white;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    opacity: 0.6;
  }
`;

const Carousel = ({ children }) => {
  smoothscroll.polyfill();

  const scrollRef = useRef();

  const _onSlideLeft = () => {
    scrollRef.current.scrollBy({
      top: 0,
      left: -500,
      behavior: "smooth",
    });
  };

  const _onSlideRight = () => {
    scrollRef.current.scrollBy({
      top: 0,
      left: 500,
      behavior: "smooth",
    });
  };

  return (
    <CarouselStyle>
      <CarouselItems ref={scrollRef}>{children}</CarouselItems>

      <PaginationTabs>
        <PaginationButton onClick={() => _onSlideLeft()}>
          <span className="icon">
            <FontAwesomeIcon icon={faAngleLeft} size="2x" />
          </span>
        </PaginationButton>
        <PaginationButton onClick={() => _onSlideRight()}>
          <span className="icon">
            <FontAwesomeIcon icon={faAngleRight} size="2x" />
          </span>
        </PaginationButton>
      </PaginationTabs>
    </CarouselStyle>
  );
};

export { Carousel };
