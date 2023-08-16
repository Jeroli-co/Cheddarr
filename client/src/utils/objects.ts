export const isEmptyObject = (obj: object) => {
  for (const key in obj) return false
  return true
}
