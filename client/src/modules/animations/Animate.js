import React, {useEffect, useState} from "react";
import styled, {css} from "styled-components";

const AnimationStyle = styled.div`
  padding: 0;
  visibility: ${ ({ active }) => active ? 'visible' : 'hidden'};
  margin-bottom: ${ ({ active, size }) => active && size ? '0' : '-' + size }px;
  ${ ({ active, isVisible, animationIn, animationOut, size, duration, count }) => active &&
    css`
      animation-name: ${isVisible ? (size ? animationIn(size) : animationIn()) : (size ? animationOut(size) : animationOut())};
      animation-duration: ${duration}s;
      animation-timing-function: linear;
      animation-iteration-count: ${count ? count : 1};
      animation-fill-mode: forwards;
    `
  }
`;

const Animate = ({ animationIn, animationOut, isVisible, size, duration, count, children }) => {

  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!active && isVisible) {
      setActive(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible]);

  return (
    <AnimationStyle
      active={active}
      isVisible={isVisible}
      animationIn={animationIn}
      animationOut={animationOut}
      size={size}
      duration={duration}
      count={count}
    >
      { children }
    </AnimationStyle>
  )
};

export {
  Animate
}
