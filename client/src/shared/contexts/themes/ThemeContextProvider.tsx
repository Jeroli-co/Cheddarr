import React from "react";
import { useDynamicContext } from "./ThemeDynamicContextProvider";
import { ThemeProvider } from "styled-components";
import { GlobalStyle } from "./GlobalStyles";
import { THEMES } from "./Themes";

export const ThemeContextProvider = ({ children }: any) => {
  const { palette, darkMode } = useDynamicContext();
  return (
    <ThemeProvider
      theme={
        darkMode
          ? { ...THEMES.dark, ...palette }
          : { ...THEMES.light, ...palette }
      }
    >
      <GlobalStyle />
      {children}
    </ThemeProvider>
  );
};
