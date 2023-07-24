import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const isEmpty = (s: string) => {
  return s.replace(/\s/g, "").length === 0;
};
export const uppercaseFirstLetter = (s: string) => {
  return s.length > 0 ? s.charAt(0).toUpperCase() + s.slice(1) : s;
};

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
