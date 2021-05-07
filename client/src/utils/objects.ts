export const isEmptyObject = (obj: object) => {
  for (let key in obj) return false;
  return true;
};
