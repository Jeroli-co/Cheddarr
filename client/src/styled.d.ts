import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    bgColor: string;
    color: string;
    primary: string;
    primaryLight: string;
    primaryLighter: string;
    secondary: string;
    success: string;
    danger: string;
    warning: string;
    info: string;
    black: string;
    white: string;
    grey: string;
    plex: string;
  }
}
