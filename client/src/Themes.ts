import { createGlobalStyle } from "styled-components";

const transparent = "rgba(198,198,198,0.17)";
const transparentDark = "rgba(146,146,146,0.5)";
const darkPlex = "#282a2d";

export interface ITheme {
  light: IPalette;
  dark: IPalette;
}

export interface IPalette {
  primary: string;
  primaryLight: string;
  primaryLighter: string;
  secondary: string;
  secondaryLight: string;
  secondaryLighter: string;
  secondaryDark: string;
  dark: string;
  transparent: string;
  transparentDark: string;
  darkPlex: string;
  bgColor: string;
}

export const themes = {
  orange: {
    light: {
      primary: "#f8813f",
      primaryLight: "#ff9761",
      primaryLighter: "#ffe3d4",
      secondary: "#f9c441",
      secondaryLight: "#ffd679",
      secondaryLighter: "#fff7c9",
      secondaryDark: "#9a702a",
      dark: "#4f4d4d",
      darkPlex: darkPlex,
      transparent: transparent,
      transparentDark: transparentDark,
      bgColor: "#ffffff",
      color: "#4f4d4d",
    },
    dark: {
      primary: "#f8813f",
      primaryLight: "#ff9761",
      primaryLighter: "#ffe3d4",
      secondary: "#f9c441",
      secondaryLight: "#ffd679",
      secondaryLighter: "#fff7c9",
      secondaryDark: "#9a702a",
      dark: "#908b8b",
      darkPlex: darkPlex,
      transparent: transparent,
      transparentDark: transparentDark,
      bgColor: "#4e4e4e",
      color: "#ffffff",
    },
  },
  blue: {
    light: {
      primary: "#1b6ae3",
      primaryLight: "#477ed9",
      primaryLighter: "#6e93d5",
      secondary: "#cb27c1",
      secondaryLight: "#ce48c4",
      secondaryLighter: "#c965c4",
      secondaryDark: "#8b1b84",
      dark: "#4f4d4d",
      darkPlex: darkPlex,
      transparent: transparent,
      transparentDark: transparentDark,
      bgColor: "#ffffff",
      color: "#4f4d4d",
    },
    dark: {
      primary: "#1b6ae3",
      primaryLight: "#477ed9",
      primaryLighter: "#6e93d5",
      secondary: "#cb27c1",
      secondaryLight: "#ce48c4",
      secondaryLighter: "#c965c4",
      secondaryDark: "#8b1b84",
      dark: "#908b8b",
      darkPlex: darkPlex,
      transparent: transparent,
      transparentDark: transparentDark,
      bgColor: "#4e4e4e",
      color: "#ffffff",
    },
  },
};

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
  }
`;
