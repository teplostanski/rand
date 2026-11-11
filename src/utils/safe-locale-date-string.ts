export const safeLocaleDateString = (date: Date, locale?: string) => {
  try {
    return date.toLocaleDateString(locale)
  } catch (_error) {
    return date.toLocaleDateString()
  }
}
