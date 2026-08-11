"use client";

import { useLocale } from "../LocaleProvider";
import { Reveal } from "../Reveal";

export function Circular() {
  const { t } = useLocale();

  return (
    <section className="section" id="circular">
      <div className="shell">
        <Reveal>
          <p className="eyebrow">{t.circular.eyebrow}</p>
          <h2 className="section-title">{t.circular.title}</h2>
          <p className="lead">{t.circular.lead}</p>
        </Reveal>

        <Reveal className="loop" delay={60}>
          {t.circular.loop.map((s, i) => (
            <span key={`${s}-${i}`}>{s}</span>
          ))}
        </Reveal>

        <Reveal className="callout" delay={80}>
          <div>
            <h3>{t.circular.buying.title}</h3>
            <p>{t.circular.buying.body}</p>
          </div>
          <a className="btn" href="#contact">
            {t.circular.buying.cta}
          </a>
        </Reveal>
      </div>
    </section>
  );
}
