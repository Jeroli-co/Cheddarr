import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle<any>`
  body {
    min-height: 100vh;
    max-width: 100vw;
    background-color: ${(props) => props.theme.bgColor};
    color: ${(props) => props.theme.color};
    transition: background 1s ease;

    * {
      transition: background .5s ease;
    }
  }
`;
