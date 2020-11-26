import { keyframes } from "styled-components";

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

export { FadeInUp, FadeOutDown, FadeIn, FadeOut };
