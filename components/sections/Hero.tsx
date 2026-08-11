"use client";

import { useLocale } from "../LocaleProvider";

export function Hero() {
  const { t } = useLocale();

  return (
    <section className="hero shell" id="top" data-heat="0.5">
      <p className="eyebrow">{t.hero.eyebrow}</p>

      <h1>
        {t.hero.title.map((line, i) => (
          <span className="line" key={`${line}-${i}`}>
            <span style={{ animationDelay: `${120 + i * 90}ms` }}>
              {i % 2 === 1 ? <em>{line}</em> : line}
            </span>
          </span>
        ))}
      </h1>

      <p className="hero-lead">{t.hero.lead}</p>

      <div className="hero-actions">
        <a className="btn" href="#contact">
          {t.cta}
        </a>
        <a className="btn btn-ghost" href="#process">
          {t.process.title}
        </a>
      </div>

      <div className="hero-stats">
        {t.hero.stats.map((s) => (
          <div key={s.label}>
            <p className="v">
              {s.value}
              {s.unit ? <sup>{s.unit}</sup> : null}
            </p>
            <p className="l">{s.label}</p>
          </div>
        ))}
      </div>

      <p className="scroll-hint">
        {t.hero.scroll}
        <span className="bar" />
      </p>
    </section>
  );
}
