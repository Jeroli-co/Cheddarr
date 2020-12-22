import React, { useContext } from "react";
import { ThemeDynamicContext } from "./ThemeDynamicContextProvider";
import { ThemeProvider } from "styled-components";
import { GlobalStyle } from "../../GlobalStyles";

export const ThemeContextProvider = ({ children }: any) => {
  const { theme, darkMode } = useContext(ThemeDynamicContext);
  return (
    <ThemeProvider theme={darkMode ? theme.dark : theme.light}>
      <GlobalStyle />
      {children}
    </ThemeProvider>
  );
};
