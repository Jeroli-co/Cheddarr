import { keyframes } from "styled-components";

export const Flip = () => {
  return keyframes`
    0% {
      transform: scaleX(0);
    }
    50% {
      transform: scaleX(-1);
    }
    100% {
      transform: scaleX(0);;
    }
  `;
};

export const Spin = () => {
  return keyframes`
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  `;
};

const FadeInUp = (height: number) => {
  return keyframes`
    from {
      visibility: visible;
      opacity: 0;
      margin-bottom: -${height}px;
    }

    to {
      opacity: 1;
      visibility: visible;
      margin-bottom: 0px;
    }
  `;
};

const FadeOutDown = (height: number) => {
  return keyframes`
    0% {
      opacity: 1;
      margin-bottom: 0px;
    }

    50% {
      opacity: .8;
    }

    100% {
      visibility: hidden;
      opacity: 0;
      margin-bottom: -${height}px;
    }
  `;
};

const FadeIn = () => {
  return keyframes`
    from {
      visibility: visible;
      opacity: 0;
    }

    to {
      visibility: visible;
      opacity: 1;
    }
  `;
};

const FadeOut = () => {
  return keyframes`
    from {
      opacity: 1;
    }

    to {
      opacity: 0;
      visibility: hidden;
    }
  `;
};

export const LoadingCard16 = () => {
  return keyframes`
    0% {
      opacity: 1;
    }
    
    16.66% {
      opacity: 0.2;
    }

    100% {
      opacity: 1
    }
  `;
};

export const LoadingCard26 = () => {
  return keyframes`
    0% {
      opacity: 1;
    }
    
    16.66% {
      opacity: 1;
    }
    
    33.32% {
      opacity: 0.2;
    }

    100% {
      opacity: 1
    }
  `;
};

export const LoadingCard36 = () => {
  return keyframes`
    0% {
      opacity: 1;
    }
    
    33.32% {
      opacity: 1;
    }
    
    49.98% {
      opacity: 0.2;
    }

    100% {
      opacity: 1
    }
  `;
};

export const LoadingCard46 = () => {
  return keyframes`
    0% {
      opacity: 1;
    }
    
    49.98% {
      opacity: 1;
    }
    
    66.64% {
      opacity: 0.2;
    }

    100% {
      opacity: 1
    }
  `;
};

export const LoadingCard56 = () => {
  return keyframes`
    0% {
      opacity: 1;
    }
    
    66.64% {
      opacity: 1;
    }
    
    83.3% {
      opacity: 0.2;
    }

    100% {
      opacity: 1
    }
  `;
};

export const LoadingCard66 = () => {
  return keyframes`
    0% {
      opacity: 1;
    }
    
    83.3% {
      opacity: 1;
    }

    100% {
      opacity: 0.2;
    }
  `;
};

export const LoadingCard14 = () => {
  return keyframes`
    0% {
      opacity: 1;
    }
    
    20% {
      opacity: 0.2;
    }

    100% {
      opacity: 1
    }
  `;
};

export const LoadingCard24 = () => {
  return keyframes`
    0% {
      opacity: 1;
    }
    
    20% {
      opacity: 1;
    }
    
    40% {
      opacity: 0.2;
    }

    100% {
      opacity: 1;
    }
  `;
};

export const LoadingCard34 = () => {
  return keyframes`
    0% {
      opacity: 1;
    }
    
    40% {
      opacity: 1;
    }
    
    60% {
      opacity: 0.2;
    }

    100% {
      opacity: 1;
    }
  `;
};

export const LoadingCard44 = () => {
  return keyframes`
    0% {
      opacity: 1;
    }
    
    60% {
      opacity: 1;
    }
    
    80% {
      opacity: 0.2;
    }

    100% {
      opacity: 1;
    }
  `;
};

export { FadeInUp, FadeOutDown, FadeIn, FadeOut };
