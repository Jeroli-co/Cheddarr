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
  overflow-y: hidden;

  scroll-behavior: smooth;

  -ms-overflow-style: none; /* IE 11 */
  scrollbar-width: none; /* Firefox 64 */
  ::-webkit-scrollbar {
    display: none;
  }
`;

type PaginationButtonProps = {
  direction: string;
  isNeeded: boolean;
};

const PaginationButton = styled.button<PaginationButtonProps>`
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
  background: ${(props) => props.theme.grey};
  color: white;
  border-radius: 50%;
  cursor: pointer;
  z-index: 1;
  
  &:focus {
    outline: none;
  }
`;

type CarouselProps = {
  children: any;
  loadPrev?: () => boolean;
  loadNext?: () => boolean;
};

const Carousel = (props: CarouselProps) => {
  smoothscroll.polyfill();

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isButtonsNeeded, setIsButtonNeeded] = useState(false);

  useEffect(() => {
    if (scrollRef.current) {
      setIsButtonNeeded(scrollRef.current.scrollWidth > window.innerWidth);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.children]);

  const _onSlideLeft = () => {
    let scrollLeft;
    if (scrollRef.current!.scrollLeft > 0) {
      scrollLeft = -((window.innerWidth + window.innerHeight) * 30) / 100;
    } else {
      scrollLeft =
        props.loadPrev !== undefined ? 0 : scrollRef.current!.scrollWidth;
    }

    scrollRef.current!.scrollBy({
      top: 0,
      left: scrollLeft,
      behavior: "smooth",
    });
  };

  const _onSlideRight = () => {
    let scrollLeft;
    if (
      scrollRef.current!.scrollLeft + window.innerWidth <
      scrollRef.current!.scrollWidth
    ) {
      scrollLeft = ((window.innerWidth + window.innerHeight) * 30) / 100;
    } else {
      if (props.loadNext !== undefined) {
        if (props.loadNext()) {
          scrollLeft = ((window.innerWidth + window.innerHeight) * 30) / 100;
        } else {
          scrollLeft = -scrollRef.current!.scrollWidth;
        }
      } else {
        scrollLeft = -scrollRef.current!.scrollWidth;
      }
    }

    scrollRef.current!.scrollBy({
      top: 0,
      left: scrollLeft,
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
      <CarouselItems ref={scrollRef}>{props.children}</CarouselItems>
    </CarouselStyle>
  );
};

export { Carousel };
