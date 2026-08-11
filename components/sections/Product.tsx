"use client";

import { useLocale } from "../LocaleProvider";
import { Reveal } from "../Reveal";
import { billetWeight, useConfig } from "../ConfigProvider";
import { site } from "@/lib/site";

export function Product() {
  const { t, locale } = useLocale();
  const cfg = useConfig();

  const kg = billetWeight(cfg.diameter, cfg.length);
  const unit = locale === "bg" ? "мм" : "mm";

  // technical drawing, scaled to the chosen billet
  const maxD = site.diameters[site.diameters.length - 1];
  const maxL = site.lengths[site.lengths.length - 1];
  const h = 24 + (cfg.diameter / maxD) * 58;
  const w = 52 + (cfg.length / maxL) * 158;

  return (
    <section className="section" id="product">
      <div className="shell">
        <Reveal>
          <p className="eyebrow">{t.product.eyebrow}</p>
          <h2 className="section-title">{t.product.title}</h2>
          <p className="lead">{t.product.lead}</p>
        </Reveal>

        <div className="product-grid">
          <Reveal className="config">
            <div className="config-row">
              <span className="mono-label">{t.product.alloyLabel}</span>
              <div className="chips">
                {site.alloys.map((a) => (
                  <button
                    key={a}
                    type="button"
                    className="chip"
                    data-active={cfg.alloy === a}
                    aria-pressed={cfg.alloy === a}
                    onClick={() => cfg.set({ alloy: a })}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            <div className="config-row">
              <span className="mono-label">
                {t.product.diameterLabel} · {unit}
              </span>
              <div className="chips">
                {site.diameters.map((d) => (
                  <button
                    key={d}
                    type="button"
                    className="chip"
                    data-active={cfg.diameter === d}
                    aria-pressed={cfg.diameter === d}
                    onClick={() => cfg.set({ diameter: d })}
                  >
                    Ø{d}
                  </button>
                ))}
              </div>
            </div>

            <div className="config-row">
              <span className="mono-label">
                {t.product.lengthLabel} · {unit}
              </span>
              <div className="chips">
                {site.lengths.map((l) => (
                  <button
                    key={l}
                    type="button"
                    className="chip"
                    data-active={cfg.length === l}
                    aria-pressed={cfg.length === l}
                    onClick={() => cfg.set({ length: l })}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <dl className="spec-table">
              {t.product.specs.map((s) => (
                <div key={s.k}>
                  <dt className="k">{s.k}</dt>
                  <dd style={{ margin: 0, textAlign: "right" }}>{s.v}</dd>
                </div>
              ))}
            </dl>

            <a className="btn" href="#contact" style={{ justifySelf: "start" }}>
              {t.product.askFor}
            </a>
          </Reveal>

          <Reveal className="billet-viz" delay={80}>
            <div className="billet-draw">
              <svg viewBox="0 0 320 180" role="img" aria-label={`${cfg.alloy} Ø${cfg.diameter} × ${cfg.length}`}>
                <defs>
                  <linearGradient id="alu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8d959f" />
                    <stop offset="18%" stopColor="#e7ebef" />
                    <stop offset="46%" stopColor="#9aa2ac" />
                    <stop offset="72%" stopColor="#d7dce1" />
                    <stop offset="100%" stopColor="#767d86" />
                  </linearGradient>
                  <linearGradient id="cap" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#eef1f4" />
                    <stop offset="100%" stopColor="#8d959f" />
                  </linearGradient>
                </defs>

                <g style={{ transition: "all 420ms cubic-bezier(0.22,1,0.36,1)" }}>
                  <rect
                    x={160 - w / 2}
                    y={90 - h / 2}
                    width={w}
                    height={h}
                    fill="url(#alu)"
                    style={{ transition: "all 420ms cubic-bezier(0.22,1,0.36,1)" }}
                  />
                  <ellipse
                    cx={160 - w / 2}
                    cy={90}
                    rx={7}
                    ry={h / 2}
                    fill="url(#cap)"
                    style={{ transition: "all 420ms cubic-bezier(0.22,1,0.36,1)" }}
                  />
                  <ellipse
                    cx={160 + w / 2}
                    cy={90}
                    rx={7}
                    ry={h / 2}
                    fill="#0b0d10"
                    opacity="0.35"
                    style={{ transition: "all 420ms cubic-bezier(0.22,1,0.36,1)" }}
                  />
                </g>

                {/* dimension lines */}
                <g stroke="currentColor" strokeWidth="0.75" opacity="0.5" fill="none">
                  <path d={`M${160 - w / 2} ${90 + h / 2 + 16} H${160 + w / 2}`} />
                  <path d={`M${160 - w / 2} ${90 + h / 2 + 11} v10`} />
                  <path d={`M${160 + w / 2} ${90 + h / 2 + 11} v10`} />
                  <path d={`M${160 + w / 2 + 22} ${90 - h / 2} V${90 + h / 2}`} />
                  <path d={`M${160 + w / 2 + 17} ${90 - h / 2} h10`} />
                  <path d={`M${160 + w / 2 + 17} ${90 + h / 2} h10`} />
                </g>
                <text
                  x="160"
                  y={90 + h / 2 + 32}
                  textAnchor="middle"
                  fill="currentColor"
                  opacity="0.75"
                  style={{ font: "500 9px var(--mono)", letterSpacing: "0.1em" }}
                >
                  {cfg.length} {unit}
                </text>
                <text
                  x={160 + w / 2 + 30}
                  y={94}
                  fill="currentColor"
                  opacity="0.75"
                  style={{ font: "500 9px var(--mono)", letterSpacing: "0.1em" }}
                >
                  Ø{cfg.diameter}
                </text>
                <text
                  x={160 - w / 2}
                  y={90 - h / 2 - 14}
                  fill="var(--accent)"
                  style={{ font: "500 10px var(--mono)", letterSpacing: "0.16em" }}
                >
                  EN AW-{cfg.alloy}
                </text>
              </svg>
            </div>

            <div className="weight">
              <div>
                <p className="mono-label">{t.product.weightLabel}</p>
                <p className="n">
                  {kg.toLocaleString(locale === "bg" ? "bg-BG" : "en-GB", {
                    maximumFractionDigits: 0,
                  })}{" "}
                  kg
                </p>
              </div>
              <p style={{ fontSize: "0.72rem", color: "var(--alu-dim)", maxWidth: "18ch" }}>
                {t.product.weightNote}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
