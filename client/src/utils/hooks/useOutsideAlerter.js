import { useEffect } from "react";

const useOutsideAlerter = (refs, onOutsideClick) => {
  useEffect(() => {
    function handleClickOutside(event) {
      let isOutside = true;
      refs.forEach((ref) => {
        isOutside =
          isOutside && ref.current && !ref.current.contains(event.target);
      });
      if (isOutside) {
        onOutsideClick();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refs]);
};

export { useOutsideAlerter };
