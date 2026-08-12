"use client";

import { useLocale } from "../LocaleProvider";
import { Reveal } from "../Reveal";
import { mapsUrl } from "@/lib/content";
import { site } from "@/lib/site";

export function LocationSection() {
  const { t, locale } = useLocale();

  return (
    <section className="section" id="location">
      <div className="shell">
        <Reveal>
          <p className="eyebrow">{t.location.eyebrow}</p>
          <h2 className="section-title">{t.location.title}</h2>
        </Reveal>

        <div className="loc-grid">
          <Reveal>
            <p className="lead" style={{ marginTop: 0 }}>
              {t.location.lead}
            </p>
            <a
              className="btn btn-ghost"
              href={mapsUrl}
              target="_blank"
              rel="noreferrer noopener"
              style={{ marginTop: "1.75rem" }}
            >
              {t.location.cta}
            </a>
          </Reveal>

          <Reveal className="loc-card" delay={60}>
            <div className="loc-row">
              <span className="mono-label">{t.misc.location}</span>
              <p>{site.address[locale]}</p>
            </div>
            <div className="loc-row">
              <span className="mono-label">E-mail</span>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </div>
            <div className="loc-row">
              <span className="mono-label">{t.misc.phone}</span>
              <a href={`tel:${site.phoneHref}`}>{site.phone}</a>
            </div>
            <div className="loc-row">
              <span className="mono-label">{t.misc.coordinates}</span>
              <p style={{ fontFamily: "var(--mono)", fontSize: "0.85rem" }}>
                {site.geo.lat.toFixed(4)} N · {site.geo.lng.toFixed(4)} E
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
