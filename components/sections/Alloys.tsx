"use client";

import { useState } from "react";
import { useLocale } from "../LocaleProvider";
import { Reveal } from "../Reveal";
import { alloyChemistry } from "@/lib/content";

const SCALE = 1.0; // weight % at the right edge of the bar

export function Alloys() {
  const { t } = useLocale();
  const [active, setActive] = useState<"6060" | "6063">("6063");

  return (
    <section className="section" id="alloys" data-heat="0.3">
      <div className="shell">
        <Reveal>
          <p className="eyebrow">{t.alloys.eyebrow}</p>
          <h2 className="section-title">{t.alloys.title}</h2>
          <p className="lead">{t.alloys.lead}</p>
        </Reveal>

        <div className="alloy-grid">
          <Reveal className="alloy-cards">
            <p className="mono-label">{t.alloys.hint}</p>
            {t.alloys.cards.map((c) => (
              <button
                type="button"
                key={c.id}
                className="alloy-card"
                data-active={active === c.id}
                aria-pressed={active === c.id}
                onClick={() => setActive(c.id as "6060" | "6063")}
              >
                <h3>{c.name}</h3>
                <p className="tag">{c.tagline}</p>
                <ul>
                  {c.uses.map((u) => (
                    <li key={u}>{u}</li>
                  ))}
                </ul>
                <p className="temper">{c.temper}</p>
              </button>
            ))}
          </Reveal>

          <Reveal delay={80}>
            <div className="chem">
              <div className="chem-head">
                {t.alloys.tableHead.map((h) => (
                  <span key={h}>{h}</span>
                ))}
              </div>

              {alloyChemistry.map((row) => (
                <div className="chem-row" key={row.el}>
                  <span className="chem-el">{row.el}</span>
                  {(["6060", "6063"] as const).map((a) => {
                    const [min, max] = row[a];
                    const left = (min / SCALE) * 100;
                    const width = Math.max(2.5, ((max - min) / SCALE) * 100);
                    return (
                      <span
                        className="chem-bar"
                        key={a}
                        data-active={active === a}
                        data-dim={active !== a}
                      >
                        <span className="track" />
                        <span
                          className="span"
                          style={{
                            left: `${left}%`,
                            width: `${width}%`,
                            background: active === a ? "var(--accent)" : undefined,
                            opacity: active === a ? 1 : 0.4,
                            boxShadow: active === a ? "0 0 14px -2px var(--accent)" : "none",
                          }}
                        />
                        <span className="val">
                          {min > 0 ? `${min.toFixed(2)}–${max.toFixed(2)}` : `≤ ${max.toFixed(2)}`}
                        </span>
                      </span>
                    );
                  })}
                </div>
              ))}

              <p className="chem-note">{t.alloys.note}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
