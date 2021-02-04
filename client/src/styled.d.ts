import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    bgColor: string;
    color: string;
    highlight: string;
    primary: string;
    primaryLight: string;
    primaryLighter: string;
    secondary: string;
    secondaryLight: string;
    secondaryLighter: string;
    secondaryDark: string;
    success: string;
    danger: string;
    warning: string;
    info: string;
    dark: string;
  }
}
