const TITLE_SIZES = {
  one: "36px",
  two: "28px",
};

const isEmpty = (s: string) => {
  return s.replace(/\s/g, "").length === 0;
};

const withoutDash = (s: string) => {
  return s.replace(/-/g, "");
};

const isArrayOfStrings = (value: any): boolean => {
  return (
    Array.isArray(value) && value.every((item) => typeof item === "string")
  );
};

export const uppercaseFirstLetter = (s: string) => {
  return s.length > 0 ? s.charAt(0).toUpperCase() + s.slice(1) : s;
};

export { isEmpty, withoutDash, TITLE_SIZES, isArrayOfStrings };
