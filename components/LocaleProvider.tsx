"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { content, type Dict } from "@/lib/content";
import { LOCALES, type Locale } from "@/lib/site";

type Ctx = { locale: Locale; t: Dict; setLocale: (l: Locale) => void };

const LocaleContext = createContext<Ctx | null>(null);

const isLocale = (v: string | null): v is Locale =>
  !!v && (LOCALES as readonly string[]).includes(v);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("bg");

  // a returning visitor keeps their language; a new one gets the browser's,
  // falling back to Bulgarian
  useEffect(() => {
    const saved = window.localStorage.getItem("aizen-locale");
    if (isLocale(saved)) {
      setLocaleState(saved);
      return;
    }
    const guess = navigator.languages
      ?.map((l) => l.slice(0, 2).toLowerCase())
      .find((l): l is Locale => isLocale(l));
    if (guess) setLocaleState(guess);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    window.localStorage.setItem("aizen-locale", l);
    setLocaleState(l);
  }, []);

  return (
    <LocaleContext.Provider value={{ locale, t: content[locale] as Dict, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used inside LocaleProvider");
  return ctx;
}
