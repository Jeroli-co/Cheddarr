import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  body {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }

  a {
    color: ${(props) => props.theme.color};
    text-decoration: none;

    &:hover {
      color: ${(props) => props.theme.grey};
    }
  }
`;
