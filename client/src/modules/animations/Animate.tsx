import * as React from "react";
import { useEffect, useState } from "react";
import styled, { css } from "styled-components";

interface AnimationProps {
  readonly isActive: boolean;
  readonly size: number | null;
  readonly animationIn: any;
  readonly animationOut: any;
  readonly duration: number;
  readonly count: number | null;
  readonly isVisible: boolean;
}

const AnimationStyle = styled.div<AnimationProps>`
  padding: 0;
  visibility: ${({ isActive }) => (isActive ? "visible" : "hidden")};
  margin-bottom: ${({ isActive, size }) =>
    isActive && size ? "0" : "-" + size}px;
  ${({
    isActive,
    isVisible,
    animationIn,
    animationOut,
    size,
    duration,
    count,
  }) =>
    isActive &&
    css`
      animation-name: ${isVisible
        ? size
          ? animationIn(size)
          : animationIn()
        : size
        ? animationOut(size)
        : animationOut()};
      animation-duration: ${duration}s;
      animation-timing-function: linear;
      animation-iteration-count: ${count ? count : 1};
      animation-fill-mode: forwards;
    `}
`;

interface AnimateProps {
  animationIn: any;
  animationOut: any;
  isVisible: boolean;
  size: number | null;
  duration: number;
  count: number | null;
  children: any;
}

const Animate = ({
  animationIn,
  animationOut,
  isVisible,
  size,
  duration,
  count,
  children,
}: AnimateProps) => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!active && isVisible) {
      setActive(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible]);

  return (
    <AnimationStyle
      isActive={active}
      isVisible={isVisible}
      animationIn={animationIn}
      animationOut={animationOut}
      size={size}
      duration={duration}
      count={count}
    >
      {children}
    </AnimationStyle>
  );
};

export { Animate };
