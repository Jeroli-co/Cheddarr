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
  darker: string;
  gray: string;
  transparent: string;
  transparentDark: string;
  darkPlex: string;
  bgColor: string;
  color: string;
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
      darker: "#2d2c2c",
      gray: "#9d9c9c",
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
      dark: "#4f4d4d",
      darker: "#2d2c2c",
      gray: "#9d9c9c",
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
      secondary: "#29c8c1",
      secondaryLight: "#57c6c1",
      secondaryLighter: "#79c4c1",
      secondaryDark: "#195b58",
      dark: "#4f4d4d",
      darker: "#2d2c2c",
      gray: "#9d9c9c",
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
      secondary: "#29c8c1",
      secondaryLight: "#57c6c1",
      secondaryLighter: "#79c4c1",
      secondaryDark: "#195b58",
      dark: "#4f4d4d",
      darker: "#2d2c2c",
      gray: "#9d9c9c",
      darkPlex: darkPlex,
      transparent: transparent,
      transparentDark: transparentDark,
      bgColor: "#4e4e4e",
      color: "#ffffff",
    },
  },
  green: {
    light: {
      primary: "#15ae1e",
      primaryLight: "#28bf30",
      primaryLighter: "#41e74b",
      secondary: "#87be21",
      secondaryLight: "#a6dd44",
      secondaryLighter: "#c3ea7b",
      secondaryDark: "#658822",
      dark: "#4f4d4d",
      darker: "#2d2c2c",
      gray: "#9d9c9c",
      darkPlex: darkPlex,
      transparent: transparent,
      transparentDark: transparentDark,
      bgColor: "#ffffff",
      color: "#4f4d4d",
    },
    dark: {
      primary: "#15ae1e",
      primaryLight: "#28bf30",
      primaryLighter: "#41e74b",
      secondary: "#87be21",
      secondaryLight: "#a6dd44",
      secondaryLighter: "#c3ea7b",
      secondaryDark: "#658822",
      dark: "#4f4d4d",
      darker: "#2d2c2c",
      gray: "#9d9c9c",
      darkPlex: darkPlex,
      transparent: transparent,
      transparentDark: transparentDark,
      bgColor: "#4e4e4e",
      color: "#ffffff",
    },
  },
};
