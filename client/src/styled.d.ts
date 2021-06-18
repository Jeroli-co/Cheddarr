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
    dangerLight: string;
    warning: string;
    warningLight: string;
    black: string;
    white: string;
    grey: string;
    plex: string;
    movie: string;
    series: string;
    season: string;
    episode: string;
  }
}
