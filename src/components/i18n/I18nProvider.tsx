import { useEffect, useState } from "react";
import { I18nextProvider, useTranslation } from "react-i18next";
import { i18n, applyDocumentDirection, loadDbOverrides, getStoredLang, changeLanguage, type Lang } from "@/lib/i18n";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}

/**
 * Mounted once near the root.
 * Critical: we MUST wait for hydration to fully complete before switching
 * the language, otherwise React sees Arabic text where the SSR HTML had
 * English and throws a hydration mismatch.
 */
export function I18nDirectionEffect() {
  const { i18n: i } = useTranslation();
  const [hydrated, setHydrated] = useState(false);

  // Mark hydration complete after first paint.
  useEffect(() => {
    setHydrated(true);
  }, []);

  // Once hydrated, apply the stored language preference.
  useEffect(() => {
    if (!hydrated) return;
    const stored = getStoredLang();
    if (stored !== i.language) {
      void changeLanguage(stored);
    } else {
      applyDocumentDirection(i.language as Lang);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    applyDocumentDirection(i.language as Lang);
  }, [i.language, hydrated]);

  useEffect(() => {
    void loadDbOverrides();
  }, []);

  return null;
}
