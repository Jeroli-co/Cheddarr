import React, {useEffect, useRef, useState} from "react";
import styled from "styled-components";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleLeft, faAngleRight} from "@fortawesome/free-solid-svg-icons";

const CarouselStyled = styled.div`
  position: relative;
`

const CarouselPages = styled.div`
  display: flex;
  overflow: hidden;
`

const CarouselPage = styled.div`
  display: flex;
  justify-content: space-between;
  margin-left: 1em;
  margin-right: 1em;
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

  const carouselPagesSize = 5;
  const carouselPagesRef = [];
  const carouselPages = [];

  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  // Creating pages
  children.forEach((child, index) => {
    if (index % carouselPagesSize === 0) {
      const page = [];
      for (let i = 0; i < carouselPagesSize; i++) {
        if (index+i < children.length) page.push(children[index+i]);
      }
      carouselPages.push(page);
      carouselPagesRef.push(React.createRef());
    }
  });

  useEffect(() => {
    carouselPagesRef[currentPageIndex].current.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    });
  }, [currentPageIndex])

  const _onPreviousPage = () => {
    const prevPageIndex = currentPageIndex > 0 ? currentPageIndex - 1 : carouselPages.length - 1;
    setCurrentPageIndex(prevPageIndex);
  };

  const _onNextPage = () => {
    const nextPageIndex = currentPageIndex < carouselPages.length - 1 ? currentPageIndex + 1 : 0;
    setCurrentPageIndex(nextPageIndex);
  };

  return (
    <CarouselStyled>

      <CarouselButtons>

        <LeftScrollButton onClick={() => _onPreviousPage()}>
          <span className="icon">
            <FontAwesomeIcon icon={faAngleLeft} size="6x"/>
          </span>
        </LeftScrollButton>

        <RightScrollButton onClick={() => _onNextPage()}>
          <span className="icon">
            <FontAwesomeIcon icon={faAngleRight} size="6x"/>
          </span>
        </RightScrollButton>

      </CarouselButtons>

      { carouselPages.length > 0 &&
        <CarouselPages>
          { carouselPages.map((page, index) =>
            <CarouselPage
              key={index}
              ref={carouselPagesRef[index]}
              index={index}
              currentPageIndex={currentPageIndex}
            >
              {page}
            </CarouselPage>)
          }
        </CarouselPages>
      }

    </CarouselStyled>
  );
};

export {
  Carousel
}
