import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { loadLang, saveLang, translate, fill, type Lang, type StringKey } from "./i18n";

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: StringKey, vars?: Record<string, string | number>) => string;
};

const C = createContext<Ctx | null>(null);

/**
 * Shared language provider. Defaults to English for existing users and reads a
 * saved preference from localStorage on mount, so the choice survives
 * navigation and refreshes. Every page reads the same context.
 */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = loadLang();
    setLangState(saved);
    document.documentElement.lang = saved;
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    saveLang(l);
    document.documentElement.lang = l;
  }, []);

  const t = useCallback(
    (key: StringKey, vars?: Record<string, string | number>) => {
      const text = translate(lang, key);
      return vars ? fill(text, vars) : text;
    },
    [lang],
  );

  const value = useMemo<Ctx>(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <C.Provider value={value}>{children}</C.Provider>;
}

// Fallback used when a component renders outside the provider (e.g. the root
// error and not-found boundaries). English is the documented default.
const FALLBACK: Ctx = {
  lang: "en",
  setLang: () => {},
  t: (key, vars) => {
    const text = translate("en", key);
    return vars ? fill(text, vars) : text;
  },
};

export function useLanguage(): Ctx {
  return useContext(C) ?? FALLBACK;
}
