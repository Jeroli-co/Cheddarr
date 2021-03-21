import styled, { css } from "styled-components";

type ImageProps = {
  width?: string;
  height?: string;
  cursor?: string;
  borderRadius?: string;
  loaded: boolean;
};

export const Image = styled.img<ImageProps>`
  width: ${(props) => (props.width ? props.width : "100%")};
  height: ${(props) => (props.height ? props.height : "100%")};
  cursor: ${(props) => (props.cursor ? props.cursor : "default")};
  border-radius: ${(props) => (props.borderRadius ? props.borderRadius : "0")};

  -webkit-transition-property: opacity;
  transition-property: opacity;
  -webkit-transition-duration: 0.3s;
  transition-duration: 0.3s;
  -webkit-transition-timing-function: cubic-bezier(0.3, 0, 0.4, 1);
  transition-timing-function: cubic-bezier(0.3, 0, 0.4, 1);
  opacity: 0;

  ${(props) =>
    props.loaded &&
    css`
      opacity: 1;
    `}
`;
