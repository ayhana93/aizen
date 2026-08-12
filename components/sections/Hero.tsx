"use client";

import { useLocale } from "../LocaleProvider";
import { SceneMount } from "../SceneMount";

export function Hero() {
  const { t } = useLocale();

  return (
    <section className="hero" id="top">
      <SceneMount />
      <span className="hero-veil" aria-hidden />

      <div className="hero-inner shell">
        <p className="eyebrow">{t.hero.eyebrow}</p>

        <h1>
          {t.hero.title.map((line, i) => (
            <span className="line" key={`${line}-${i}`}>
              {i % 2 === 1 ? <em>{line}</em> : line}
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
      </div>
    </section>
  );
}
