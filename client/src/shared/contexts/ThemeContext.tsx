import React from "react";
import { ThemeProvider } from "styled-components";
import { GlobalStyle } from "../../GlobalStyles";
import { THEMES } from "../../Themes";

export const ThemeContext = ({ children }: any) => {
  return (
    <ThemeProvider theme={{ ...THEMES }}>
      <GlobalStyle />
      {children}
    </ThemeProvider>
  );
};
