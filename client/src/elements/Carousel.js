import React, {useEffect, useReducer} from "react";
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
  justify-content: space-around;
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
  border: none;

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
  transition: .6s ease;
  z-index: 1;
  border: none;

  &:hover {
    opacity: 1;
    color: white;
    background: rgba(0,0,0,.5);
  }
`;

const Carousel = ({ children }) => {

  const carouselPagesSize = 5;
  const carouselPages = [];

  // Creating pages
  children.forEach((child, index) => {
    if (index % carouselPagesSize === 0) {
      const page = [];
      for (let i = 0; i < carouselPagesSize; i++) {
        if (index+i < children.length) page.push(children[index+i]);
      }
      carouselPages.push({ page: page, ref: React.createRef() });
    }
  });

  const initialState = {
    prevPageIndex: carouselPages.length - 1,
    currentPageIndex: 0,
    nextPageIndex: 1,
  }

  const initReducer = () => {
    return initialState;
  }

  const reducer = (state, action) => {
    switch (action.type) {
      case 'prev-page':
        return {
          prevPageIndex: state.prevPageIndex !== 0 ? (state.prevPageIndex - 1) % carouselPages.length : carouselPages.length - 1,
          currentPageIndex: state.prevPageIndex,
          nextPageIndex: state.currentPageIndex,
        }
      case 'next-page':
        return {
          prevPageIndex: state.currentPageIndex,
          currentPageIndex: state.nextPageIndex,
          nextPageIndex: (state.nextPageIndex + 1) % carouselPages.length,
        }
      default:
        throw new Error("No action matched");
    }
  };

  const scrollToRef = (ref) => {
    ref.current.scrollIntoView({
      behavior: 'smooth',
      inline: 'center'
    });
  }

  const [state, dispatch] = useReducer(reducer, initialState, initReducer);

  useEffect(() => {
    scrollToRef(carouselPages[state.currentPageIndex].ref);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <CarouselStyled>

      <CarouselButtons>
        <LeftScrollButton onClick={() => dispatch({type: 'prev-page'})}>
          <span className="icon">
            <FontAwesomeIcon icon={faAngleLeft} size="6x"/>
          </span>
        </LeftScrollButton>

        <RightScrollButton onClick={() => dispatch({type: 'next-page'})}>
          <span className="icon">
            <FontAwesomeIcon icon={faAngleRight} size="6x"/>
          </span>
        </RightScrollButton>
      </CarouselButtons>

      { carouselPages.length > 0 &&
        <CarouselPages>
          { carouselPages.map((page, index) =>
            <CarouselPage key={index} ref={page.ref}>
              { page.page }
            </CarouselPage>
          )}
        </CarouselPages>
      }

    </CarouselStyled>
  );
};

export {
  Carousel
}
