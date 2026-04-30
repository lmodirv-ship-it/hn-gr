import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { LANG_META, SUPPORTED_LANGS, seedResources, type Lang } from "./resources";
import { supabase } from "@/integrations/supabase/client";

const STORAGE_KEY = "hn.lang";

function detectInitialLang(): Lang {
  if (typeof window === "undefined") return "en";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && (SUPPORTED_LANGS as readonly string[]).includes(stored)) return stored as Lang;
  } catch {
    /* noop */
  }
  const nav = (window.navigator?.language ?? "en").toLowerCase();
  if (nav.startsWith("ar")) return "ar";
  return "en";
}

if (!i18n.isInitialized) {
  void i18n.use(initReactI18next).init({
    resources: seedResources as unknown as Record<string, { translation: Record<string, string> }>,
    lng: detectInitialLang(),
    fallbackLng: "en",
    supportedLngs: [...SUPPORTED_LANGS],
    interpolation: { escapeValue: false },
    returnNull: false,
  });
}

export function applyDocumentDirection(lang: Lang) {
  if (typeof document === "undefined") return;
  const dir = LANG_META[lang].dir;
  document.documentElement.lang = lang;
  document.documentElement.dir = dir;
}

export async function changeLanguage(lang: Lang) {
  await i18n.changeLanguage(lang);
  applyDocumentDirection(lang);
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* noop */
    }
  }
}

/**
 * Loads admin-edited overrides from the `translations` table and merges
 * them on top of the seed bundle so admins can change wording without
 * touching code.
 */
export async function loadDbOverrides() {
  try {
    const { data, error } = await supabase
      .from("translations")
      .select("key, lang, value");
    if (error || !data) return;
    for (const row of data as { key: string; lang: string; value: string }[]) {
      if (!(SUPPORTED_LANGS as readonly string[]).includes(row.lang)) continue;
      i18n.addResource(row.lang, "translation", row.key, row.value, true, true);
    }
  } catch (e) {
    console.warn("[i18n] Failed to load DB overrides:", e);
  }
}

export { i18n, LANG_META, SUPPORTED_LANGS };
export type { Lang };
