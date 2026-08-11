"use client";

import { useLocale } from "../LocaleProvider";
import { site } from "@/lib/site";

export function Footer() {
  const { t, locale } = useLocale();

  return (
    <footer className="footer">
      <div className="shell">
        <div className="footer-grid">
          <div className="footer-brand">
            <p className="brand-word" style={{ fontSize: "1.3rem" }}>
              {site.name}
            </p>
            <p style={{ color: "var(--alu-dim)", marginTop: "0.8rem", maxWidth: "34ch" }}>
              {t.footer.tagline}
            </p>
          </div>

          <div>
            <h4>{t.footer.nav}</h4>
            <ul>
              {t.nav.map((n) => (
                <li key={n.id}>
                  <a href={`#${n.id}`}>{n.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4>{t.footer.contacts}</h4>
            <ul>
              <li>{site.address[locale]}</li>
              <li>
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </li>
              <li>
                <a href={`tel:${site.phoneHref}`}>{site.phone}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bar">
          <span>
            © {new Date().getFullYear()} {site.name}. {t.footer.rights}
          </span>
          <span>{site.address[locale]}</span>
        </div>
      </div>
    </footer>
  );
}
