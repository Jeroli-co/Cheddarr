import { useEffect } from "react";

const useOutsideAlerter = (refs: any[], onOutsideClick: () => any) => {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: any) {
      let isOutside = true;
      refs.forEach((ref) => {
        isOutside =
          isOutside && ref.current && !ref.current.contains(event.target);
      });
      if (isOutside) {
        onOutsideClick();
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refs]);
};

export { useOutsideAlerter };
