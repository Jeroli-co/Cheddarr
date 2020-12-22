import React, { useEffect, useState } from "react";
import { ITheme, themes } from "../../Themes";

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
  const [theme, setTheme] = useState<ITheme | null>(null);

  const switchTheme = (theme: ITheme) => {
    localStorage.setItem("currentTheme", JSON.stringify(theme));
    setTheme(theme);
  };

  const toggleDarkMode = () => {
    const darkModeToggled = !darkMode;
    localStorage.setItem("darkModeEnabled", darkModeToggled.toString());
    setDarkMode(darkModeToggled);
  };

  useEffect(() => {
    const localDarkMode = localStorage.getItem("darkModeEnabled");
    if (localDarkMode) {
      setDarkMode(localDarkMode === "true");
    } else {
      setDarkMode(
        window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches
      );
    }

    const localTheme = localStorage.getItem("currentTheme");
    if (localTheme) {
      setTheme(JSON.parse(localTheme));
    } else {
      setTheme(themes.orange);
    }
  }, []);

  if (darkMode === null || theme === null) return <div />;

  return (
    <ThemeDynamicContext.Provider
      value={{ darkMode, toggleDarkMode, theme, switchTheme }}
    >
      {children}
    </ThemeDynamicContext.Provider>
  );
};
