"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "./LocaleProvider";
import { site } from "@/lib/site";

export function Header() {
  const { t, toggle } = useLocale();
  const [stuck, setStuck] = useState(false);
  const [logoOk, setLogoOk] = useState(true);
  const logo = useRef<HTMLImageElement>(null);

  // the 404 can land before React hydrates, so check the element too
  useEffect(() => {
    const img = logo.current;
    if (img && img.complete && img.naturalWidth === 0) setLogoOk(false);
  }, []);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="header" data-stuck={stuck}>
      <a className="brand" href="#top" aria-label={site.name}>
        {logoOk ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            ref={logo}
            src="/media/logo.png"
            alt={site.name}
            onError={() => setLogoOk(false)}
          />
        ) : (
          <span className="brand-word">{site.name}</span>
        )}
      </a>

      <nav className="nav" aria-label={t.footer.nav}>
        {t.nav.map((n) => (
          <a key={n.id} href={`#${n.id}`}>
            {n.label}
          </a>
        ))}
      </nav>

      <div className="header-tools">
        <button className="lang" onClick={toggle} aria-label="Switch language">
          {t.langLabel}
        </button>
        <a className="btn" href="#contact">
          {t.cta}
        </a>
      </div>
    </header>
  );
}
