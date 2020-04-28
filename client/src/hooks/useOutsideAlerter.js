import { useEffect } from "react";

const useOutsideAlerter = (
  excludedRef1,
  excludedRef2,
  excludedRef3,
  onOutsideClick
) => {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (
        excludedRef1.current &&
        !excludedRef1.current.contains(event.target) &&
        excludedRef2.current &&
        !excludedRef2.current.contains(event.target) &&
        excludedRef3.current &&
        !excludedRef3.current.contains(event.target)
      ) {
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
  }, [excludedRef1, excludedRef2, excludedRef3]);
};

export { useOutsideAlerter };
