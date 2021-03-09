import React from "react";
import styled, { keyframes } from "styled-components";
import { MediaPreviewCardContainer } from "./MediaPreviewCard";
import { Row } from "../layout/Row";
import { STATIC_STYLES } from "../../enums/StaticStyles";

const Blink110 = () => {
  return keyframes`
    0% {
      opacity: 1;
    }
    
    10% {
      opacity: 0;
    }
    
    20% {
      opacity: 1;
    }

    100% {
      opacity: 1
    }
  `;
};

const Blink210 = () => {
  return keyframes`
    0% {
      opacity: 1;
    }
    
    10% {
      opacity: 1;
    }
    
    20% {
      opacity: 0;
    }
    
    30% {
      opacity: 1;
    }

    100% {
      opacity: 1
    }
  `;
};

const Blink310 = () => {
  return keyframes`
    0% {
      opacity: 1;
    }
    
    20% {
      opacity: 1;
    }
    
    30% {
      opacity: 0;
    }
    
    40% {
      opacity: 1;
    }

    100% {
      opacity: 1
    }
  `;
};

const Blink410 = () => {
  return keyframes`
    0% {
      opacity: 1;
    }
    
    30% {
      opacity: 1;
    }
    
    40% {
      opacity: 0;
    }
    
    50% {
      opacity: 1;
    }

    100% {
      opacity: 1
    }
  `;
};

const Blink510 = () => {
  return keyframes`
    0% {
      opacity: 1;
    }
    
    40% {
      opacity: 1;
    }
    
    50% {
      opacity: 0;
    }
    
    60% {
      opacity: 1;
    }

    100% {
      opacity: 1
    }
  `;
};

const Blink610 = () => {
  return keyframes`
    0% {
      opacity: 1;
    }
    
    50% {
      opacity: 1;
    }
    
    60% {
      opacity: 0;
    }
    
    70% {
      opacity: 1;
    }

    100% {
      opacity: 1
    }
  `;
};

const MediaLoadingCardContainer = styled(MediaPreviewCardContainer)`
  background: ${(props) => props.theme.primary};
  animation: 1s ease infinite running;

  &:nth-child(1) {
    animation-name: ${Blink110};
  }

  &:nth-child(2) {
    animation-name: ${Blink210};
  }

  &:nth-child(3) {
    animation-name: ${Blink310};
  }

  &:nth-child(4) {
    animation-name: ${Blink410};
  }

  &:nth-child(5) {
    animation-name: ${Blink510};
  }

  &:nth-child(6) {
    animation-name: ${Blink610};
  }

  @media screen and (max-width: ${STATIC_STYLES.TABLET_MAX_WIDTH}px) {
    &:nth-child(5) {
      display: none;
    }

    &:nth-child(6) {
      display: none;
    }
  }
`;

export const MediaLoadingCard = () => {
  return (
    <MediaLoadingCardContainer>
      <svg className="media-poster" viewBox="0 0 2 3" />
    </MediaLoadingCardContainer>
  );
};

export const MediaCardsLoader = () => {
  return (
    <Row>
      <MediaLoadingCard />
      <MediaLoadingCard />
      <MediaLoadingCard />
      <MediaLoadingCard />
      <MediaLoadingCard />
      <MediaLoadingCard />
    </Row>
  );
};
