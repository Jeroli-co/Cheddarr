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
          ? {
              ...THEMES.dark,
              ...palette,
              ...THEMES.constColor,
              dark: "#4e4e4e",
            }
          : {
              ...THEMES.light,
              ...palette,
              ...THEMES.constColor,
              dark: "#4e4e4e",
            }
      }
    >
      <GlobalStyle />
      {children}
    </ThemeProvider>
  );
};
