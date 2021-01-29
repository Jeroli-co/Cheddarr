import { useEffect, useRef } from "react";

export const usePreviousState = (value: any) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};
