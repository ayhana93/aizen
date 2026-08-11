"use client";

import { useLocale } from "../LocaleProvider";
import { Reveal } from "../Reveal";
import { Plate } from "../Plate";

/** The heat each stage runs at, normalised — this is what drives the page. */
const stageHeat = [0.12, 0.98, 1, 0.9, 0.62, 0.08];

export function Process() {
  const { t } = useLocale();

  return (
    <section className="section" id="process">
      <div className="shell">
        <Reveal>
          <p className="eyebrow">{t.process.eyebrow}</p>
          <h2 className="section-title">{t.process.title}</h2>
          <p className="lead">{t.process.lead}</p>
        </Reveal>

        <div className="process-list">
          {t.process.steps.map((s, i) => (
            <Reveal
              as="article"
              className="step"
              key={s.n}
              data-heat={stageHeat[i]}
              delay={40}
            >
              <span className="step-n">{s.n}</span>
              <div>
                <h3>{s.title}</h3>
                <span className="step-temp">{s.temp}</span>
              </div>
              <p>{s.body}</p>
            </Reveal>
          ))}
        </div>

        <div className="gallery">
          <Plate
            src="/media/furnace.jpg"
            alt={t.process.steps[1].title}
            caption={t.process.steps[1].temp}
            hint="furnace"
          />
          <Plate
            src="/media/casting.jpg"
            alt={t.process.steps[3].title}
            caption={t.process.steps[3].temp}
            hint="casting pit"
          />
          <Plate
            src="/media/billets.jpg"
            alt={t.process.steps[5].title}
            caption={t.process.steps[5].temp}
            hint="finished billets"
          />
        </div>
      </div>
    </section>
  );
}
