"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { content, type Dict } from "@/lib/content";
import type { Locale } from "@/lib/site";

type Ctx = { locale: Locale; t: Dict; toggle: () => void };

const LocaleContext = createContext<Ctx | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("bg");

  useEffect(() => {
    const saved = window.localStorage.getItem("aizen-locale");
    if (saved === "bg" || saved === "en") setLocale(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const toggle = useCallback(() => {
    setLocale((l) => {
      const next: Locale = l === "bg" ? "en" : "bg";
      window.localStorage.setItem("aizen-locale", next);
      return next;
    });
  }, []);

  return (
    <LocaleContext.Provider value={{ locale, t: content[locale] as Dict, toggle }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used inside LocaleProvider");
  return ctx;
}
