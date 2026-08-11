"use client";

import { useEffect, useState } from "react";
import { useLocale } from "../LocaleProvider";
import { SceneMount } from "../SceneMount";
import { goToStage, onStage, type Phase } from "@/lib/stage";
import { heatToCelsius, onHeat } from "@/lib/heat";

export function Hero() {
  const { t } = useLocale();
  const [{ phase, u }, setStage] = useState({ phase: 0 as Phase, u: 0 });
  const [celsius, setCelsius] = useState(720);

  useEffect(() => onStage((s) => setStage({ phase: s.phase, u: s.u })), []);
  useEffect(() => onHeat((h) => setCelsius(heatToCelsius(h))), []);

  return (
    <section className="hero" id="top">
      <SceneMount />
      <span className="hero-veil" aria-hidden />

      <div className="hero-inner shell">
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

        {/* the reel is steerable: pick a stage and the scene jumps to it */}
        <div className="stage-hud">
          {t.hero.stages.map((s, i) => (
            <button
              key={s.label}
              type="button"
              className="stage-chip"
              data-active={phase === i}
              aria-pressed={phase === i}
              onClick={() => goToStage(i as Phase)}
            >
              <span className="n">{s.n}</span>
              {s.label}
              <i style={{ width: phase === i ? `${u * 100}%` : 0 }} />
            </button>
          ))}
          <span className="stage-temp">
            <b>{celsius}</b> °C
          </span>
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
