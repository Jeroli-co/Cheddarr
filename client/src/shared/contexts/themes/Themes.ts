export interface ITheme {
  light: IThemeProperties;
  dark: IThemeProperties;
}

export interface IThemeProperties {
  bgColor: string;
  color: string;
  highlight: string;
}

export const THEMES: ITheme = {
  light: {
    bgColor: "#ffffff",
    color: "#4f4d4d",
    highlight: "#dedede",
  },
  dark: {
    bgColor: "#4e4e4e",
    color: "#ffffff",
    highlight: "#6d6d6d",
  },
};
