"use client";

import { useEffect, useState } from "react";
import { useLocale } from "./LocaleProvider";
import { Logo } from "./Logo";
import { LOCALES, LOCALE_LABELS } from "@/lib/site";

export function Header() {
  const { t, locale, setLocale } = useLocale();
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="header" data-stuck={stuck}>
      <Logo variant="lockup" height={38} className="brand" />

      <nav className="nav" aria-label={t.footer.nav}>
        {t.nav.map((n) => (
          <a key={n.id} href={`#${n.id}`}>
            {n.label}
          </a>
        ))}
      </nav>

      <div className="header-tools">
        <div className="lang" role="group" aria-label="Language">
          {LOCALES.map((l) => (
            <button
              key={l}
              type="button"
              data-active={locale === l}
              aria-pressed={locale === l}
              lang={l}
              onClick={() => setLocale(l)}
            >
              {LOCALE_LABELS[l]}
            </button>
          ))}
        </div>
        <a className="btn" href="#contact">
          {t.cta}
        </a>
      </div>
    </header>
  );
}
