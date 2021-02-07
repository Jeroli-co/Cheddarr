import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    min-height: 100vh;
    max-width: 100vw;
    background-color: ${(props) => props.theme.bgColor};
    color: ${(props) => props.theme.color};
    transition: background .5s ease;
  }
`;
