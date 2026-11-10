export const safeLocaleDateString = (date: Date, locale?: string) => {
  try {
    return date.toLocaleDateString(locale);
  } catch (error) {
    return date.toLocaleDateString();
  }
};
