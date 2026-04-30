import { useEffect } from "react";
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

  // Apply stored language only AFTER hydration is fully complete.
  // We wait for two animation frames + a small delay to guarantee React
  // has finished hydration reconciliation before swapping any text.
  useEffect(() => {
    let cancelled = false;
    const apply = () => {
      if (cancelled) return;
      const stored = getStoredLang();
      if (stored !== i.language) {
        void changeLanguage(stored);
      } else {
        applyDocumentDirection(i.language as Lang);
      }
    };
    // Double-RAF ensures hydration commit has flushed
    const raf1 = requestAnimationFrame(() => {
      const raf2 = requestAnimationFrame(() => {
        // Extra timeout for safety on slow devices
        setTimeout(apply, 50);
      });
      // store inner raf for cleanup via closure
      (apply as any)._raf2 = raf2;
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf1);
    };
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
