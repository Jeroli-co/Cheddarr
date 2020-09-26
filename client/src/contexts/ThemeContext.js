import React from "react";
import { ThemeProvider } from "styled-components";

const theme = {
  primary: "#f8813f",
  primaryLight: "#ff9761",
  primaryLighter: "#ffe3d4",
  secondary: "#f9c441",
  secondaryLight: "#ffd679",
  secondaryLighter: "#fff7c9",
  secondaryDark: "#9a702a",
  dark: "#4f4d4d",
  transparent: "rgba(198,198,198,0.17)",
  transparentDark: "rgba(146,146,146,0.5)",
  darkPlex: "#282a2d",
};

const ThemeContextProvider = (props) => {
  return <ThemeProvider theme={theme}>{props.children}</ThemeProvider>;
};

export { ThemeContextProvider };
