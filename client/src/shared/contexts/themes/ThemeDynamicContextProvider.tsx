import React, { useContext, useEffect, useState } from "react";
import { IPalette, ORANGE_PALETTE } from "./Palettes";

interface IThemeContext {
  darkMode: boolean;
  toggleDarkMode: () => void;
  palette: IPalette;
  switchPalette: (palette: IPalette) => void;
}

export const ThemeDynamicContext = React.createContext<IThemeContext>({
  darkMode: false,
  toggleDarkMode: () => {},
  palette: ORANGE_PALETTE,
  switchPalette(_: IPalette): void {},
});

export const ThemeDynamicContextProvider = ({ children }: any) => {
  const [darkMode, setDarkMode] = useState<boolean | null>(null);
  const [palette, setPalette] = useState<IPalette | null>(null);

  const switchPalette = (palette: IPalette) => {
    localStorage.setItem("currentPalette", JSON.stringify(palette));
    setPalette(palette);
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

    const localPalette = localStorage.getItem("currentPalette");
    if (localPalette) {
      setPalette(JSON.parse(localPalette));
    } else {
      setPalette(ORANGE_PALETTE);
    }
  }, []);

  if (darkMode === null || palette === null) return <div />;

  return (
    <ThemeDynamicContext.Provider
      value={{ darkMode, toggleDarkMode, palette, switchPalette }}
    >
      {children}
    </ThemeDynamicContext.Provider>
  );
};

export const useDynamicContext = () => useContext(ThemeDynamicContext);
