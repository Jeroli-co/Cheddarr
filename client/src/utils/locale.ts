export type SupportedBrowserLocale = "en" | "en-us" | "fr";
export const defaultLocale: SupportedBrowserLocale = "en";

const locale =
  navigator.languages && navigator.languages.length
    ? navigator.languages[0]
    : navigator.language;

export default locale;
