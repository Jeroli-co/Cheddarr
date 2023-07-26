import { format, Locale } from "date-fns";
import { enUS, fr } from "date-fns/locale";
import locale, { defaultLocale, SupportedBrowserLocale } from "./locale";

const mapLocales: Record<SupportedBrowserLocale, Locale> = {
  "en-us": enUS,
  en: enUS,
  fr,
};

const browserLocale = mapLocales[locale ?? defaultLocale];

export const formatLocalDate = (date: Date) => {
  return format(date, "PPp", browserLocale);
};
