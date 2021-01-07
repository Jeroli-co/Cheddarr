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
  bgColor: string;
  color: string;
  highlight: string;
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
      bgColor: "#ffffff",
      color: "#4f4d4d",
      highlight: "#dedede",
    },
    dark: {
      primary: "#f8813f",
      primaryLight: "#ff9761",
      primaryLighter: "#ffe3d4",
      secondary: "#f9c441",
      secondaryLight: "#ffd679",
      secondaryLighter: "#fff7c9",
      secondaryDark: "#9a702a",
      bgColor: "#4e4e4e",
      color: "#ffffff",
      highlight: "#6d6d6d",
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
      bgColor: "#ffffff",
      color: "#4f4d4d",
      highlight: "#dedede",
    },
    dark: {
      primary: "#1b6ae3",
      primaryLight: "#477ed9",
      primaryLighter: "#6e93d5",
      secondary: "#29c8c1",
      secondaryLight: "#57c6c1",
      secondaryLighter: "#79c4c1",
      secondaryDark: "#195b58",
      bgColor: "#4e4e4e",
      color: "#ffffff",
      highlight: "#6d6d6d",
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
      bgColor: "#ffffff",
      color: "#4f4d4d",
      highlight: "#dedede",
    },
    dark: {
      primary: "#15ae1e",
      primaryLight: "#28bf30",
      primaryLighter: "#41e74b",
      secondary: "#87be21",
      secondaryLight: "#a6dd44",
      secondaryLighter: "#c3ea7b",
      secondaryDark: "#658822",
      bgColor: "#4e4e4e",
      color: "#ffffff",
      highlight: "#6d6d6d",
    },
  },
};
