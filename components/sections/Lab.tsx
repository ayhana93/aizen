"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "../LocaleProvider";
import { Reveal } from "../Reveal";
import { Plate } from "../Plate";

/** Illustrative spectrometer reading for the sample certificate (EN AW-6063). */
const sample = [
  { el: "Si", v: 0.43 },
  { el: "Fe", v: 0.21 },
  { el: "Mg", v: 0.58 },
  { el: "Mn", v: 0.04 },
  { el: "Cu", v: 0.02 },
];

export function Lab() {
  const { t } = useLocale();
  const [run, setRun] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setRun(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="section lab" id="lab" data-heat="0.04">
      <div className="shell">
        <Reveal>
          <p className="eyebrow">{t.lab.eyebrow}</p>
          <h2 className="section-title">{t.lab.title}</h2>
          <p className="lead">{t.lab.lead}</p>
        </Reveal>

        <div className="lab-grid">
          <Reveal>
            <div className="lab-points">
              {t.lab.points.map((p) => (
                <article key={p.title}>
                  <h3>{p.title}</h3>
                  <p>{p.body}</p>
                </article>
              ))}
            </div>
            <div style={{ marginTop: "1.75rem" }}>
              <Plate
                src="/media/lab.jpg"
                alt={t.lab.eyebrow}
                caption={t.lab.readout}
                ratio="16 / 10"
                hint="laboratory"
              />
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div className="cert" ref={box}>
              <header>
                <h3>{t.lab.certTitle}</h3>
                <span className="stamp">AIZEN METAL · QC</span>
              </header>

              <div className="cert-fields">
                {t.lab.certFields.map(([k, v]) => (
                  <div key={k}>
                    <p className="k">{k}</p>
                    <p className="v">{v}</p>
                  </div>
                ))}
              </div>

              <div className="readout">
                <p className="k" style={{ letterSpacing: "0.14em", color: "#6b7178" }}>
                  {t.lab.readout}
                </p>
                {sample.map((s, i) => (
                  <div className="r" key={s.el}>
                    <span>{s.el}</span>
                    <span className="rbar">
                      <i
                        style={{
                          width: run ? `${Math.min(100, s.v * 110)}%` : 0,
                          transitionDelay: `${i * 90}ms`,
                        }}
                      />
                    </span>
                    <span className="rv">{s.v.toFixed(2)} %</span>
                  </div>
                ))}
              </div>

              <p className="cert-foot">{t.lab.certFoot}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
