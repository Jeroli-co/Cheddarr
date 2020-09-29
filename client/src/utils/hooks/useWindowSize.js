import { useEffect, useState } from "react";
import { STATIC_STYLE } from "../../STATIC_STYLE";

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
    windowSize.height - STATIC_STYLE.NAVBAR_HEIGHT;

  return {
    ...windowSize,
    getHeightMinusNavbar,
  };
};

export { useWindowSize };