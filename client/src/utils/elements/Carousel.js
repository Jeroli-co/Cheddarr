import React, { useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import smoothscroll from "smoothscroll-polyfill";

const CarouselStyle = styled.div`
  position: relative;

  .pagination-button {
    transition: 0.6s ease;
    visibility: hidden;
    opacity: 0;
  }

  &:hover .pagination-button {
    @media only screen and (min-width: 768px) {
      visibility: visible;
      opacity: 0.8;
    }
  }
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

const PaginationButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${(props) =>
    props.direction === "left" &&
    css`
      left: 0;
    `}
  ${(props) =>
    props.direction === "right" &&
    css`
      right: 0;
    `}
  display: ${(props) => (props.isNeeded ? "flex" : "none")};
  justify-content: center;
  align-items: center;
  margin: 1em;
  min-width: 60px;
  max-width: 60px;
  height: 60px;
  border: 1px solid transparent;
  background: ${(props) => props.theme.dark};
  color: white;
  border-radius: 50%;
  cursor: pointer;
  z-index: 1;
`;

const Carousel = ({ children }) => {
  smoothscroll.polyfill();

  const scrollRef = useRef();
  const [isButtonsNeeded, setIsButtonNeeded] = useState(false);

  useEffect(() => {
    if (scrollRef.current) {
      setIsButtonNeeded(scrollRef.current.scrollWidth > window.innerWidth);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const _onSlideLeft = () => {
    const left =
      scrollRef.current.scrollLeft > 0
        ? -((window.innerWidth + window.innerHeight) * 30) / 100
        : scrollRef.current.scrollWidth;

    scrollRef.current.scrollBy({
      top: 0,
      left: left,
      behavior: "smooth",
    });
  };

  const _onSlideRight = () => {
    const left =
      scrollRef.current.scrollLeft + window.innerWidth <
      scrollRef.current.scrollWidth
        ? ((window.innerWidth + window.innerHeight) * 30) / 100
        : -scrollRef.current.scrollWidth;

    scrollRef.current.scrollBy({
      top: 0,
      left: left,
      behavior: "smooth",
    });
  };

  return (
    <CarouselStyle>
      <PaginationButton
        className="pagination-button"
        isNeeded={isButtonsNeeded}
        direction="left"
        onClick={() => _onSlideLeft()}
      >
        <FontAwesomeIcon icon={faAngleLeft} size="4x" />
      </PaginationButton>
      <PaginationButton
        className="pagination-button"
        isNeeded={isButtonsNeeded}
        direction="right"
        onClick={() => _onSlideRight()}
      >
        <FontAwesomeIcon icon={faAngleRight} size="4x" />
      </PaginationButton>

      <CarouselItems ref={scrollRef}>{children}</CarouselItems>
    </CarouselStyle>
  );
};

export { Carousel };
