import { useEffect } from "react";
import { I18nextProvider, useTranslation } from "react-i18next";
import { i18n, applyDocumentDirection, loadDbOverrides, getStoredLang, changeLanguage, type Lang } from "@/lib/i18n";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}

/** Mounted once near the root: applies dir/lang to <html> and pulls DB overrides. */
export function I18nDirectionEffect() {
  const { i18n: i } = useTranslation();

  // Apply the user's stored/browser language only after hydration to avoid SSR mismatches.
  useEffect(() => {
    const stored = getStoredLang();
    if (stored !== i.language) {
      void changeLanguage(stored);
    } else {
      applyDocumentDirection(i.language as Lang);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    applyDocumentDirection(i.language as Lang);
  }, [i.language]);

  useEffect(() => {
    void loadDbOverrides();
  }, []);

  return null;
}
