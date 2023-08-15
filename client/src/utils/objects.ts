export const isEmptyObject = (obj: object) => {
  for (const key in obj) return false
  return true
}

export const replaceNullWithUndefined = (obj: Record<string, unknown>) => {
  for (const key in obj) {
    if (obj[key] === null) {
      obj[key] = undefined
    }
  }

  return obj
}
