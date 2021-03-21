import React from "react";
import styled, { keyframes } from "styled-components";

const Pulse = () => {
  return keyframes`
    from {
      stroke-width: 3px;
      stroke-opacity: 1;
      transform: scale(0.3);
    }
    to {
      stroke-width: 0;
      stroke-opacity: 0;
      transform: scale(2);    
    }
  `;
};

const Container = styled.div`
  z-index: 10;
  background: ${(props) => props.theme.black};
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;

  circle {
    stroke: white;
    stroke-width: 2px;
    stroke-opacity: 1;

    .pulse {
      fill: white;
      fill-opacity: 0;
      transform-origin: 50% 50%;
      animation-duration: 2s;
      animation-name: ${Pulse};
      animation-iteration-count: infinite;
    }
  }
`;

const PageLoader = () => {
  return (
    <Container>
      <svg height="100px" width="100px">
        <circle cx="50%" cy="50%" r="7px" />
        <circle className="pulse" cx="50%" cy="50%" r="10px" />
      </svg>
      <p>Wait ...</p>
    </Container>
  );
};

export { PageLoader };
