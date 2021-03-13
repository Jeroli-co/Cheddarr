import { useEffect, useState } from "react";

export const useImage = (src: string | null | undefined) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (src) {
      const img = new Image();
      img.src = src;
      img.onload = () => setLoaded(true);
      img.onerror = () => setError(true);
    }
  }, [src]);

  return {
    loaded,
    error,
  };
};
