import { useEffect, useState } from "react";
import { STATIC_STYLES } from "../enums/StaticStyles";

const getWindowSize = () => {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
};

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState(getWindowSize());

  useEffect(() => {
    const handleResize = () => {
      const size = getWindowSize();
      setWindowSize(size);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getHeightMinusNavbar = () =>
    windowSize.height - STATIC_STYLES.NAVBAR_HEIGHT;

  return {
    ...windowSize,
    getHeightMinusNavbar,
  };
};

export { useWindowSize };
