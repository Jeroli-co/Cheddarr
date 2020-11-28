import React, { useEffect, useState } from "react";
import { ITheme, themes } from "./Themes";

interface IThemeContext {
  darkMode: boolean;
  toggleDarkMode: () => void;
  theme: ITheme;
  switchTheme: (theme: ITheme) => void;
}

export const ThemeDynamicContext = React.createContext<IThemeContext>({
  darkMode: false,
  toggleDarkMode: () => {},
  theme: themes.orange,
  switchTheme: (_: ITheme) => {},
});

export const ThemeDynamicContextProvider = ({ children }: any) => {
  const [darkMode, setDarkMode] = useState<boolean | null>(null);
  const [theme, setTheme] = useState<ITheme>(themes.orange);

  const switchTheme = (theme: ITheme) => setTheme(theme);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  useEffect(() => {
    setDarkMode(
      window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  }, []);

  if (darkMode === null) return <div />;

  return (
    <ThemeDynamicContext.Provider
      value={{ darkMode, toggleDarkMode, theme, switchTheme }}
    >
      {children}
    </ThemeDynamicContext.Provider>
  );
};
