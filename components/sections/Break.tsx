"use client";

import { useLocale } from "../LocaleProvider";

/**
 * A gap between chapters where the furnace shows through — no panel, no card,
 * just the statement and the heat behind it.
 */
export function Break() {
  const { t } = useLocale();

  return (
    <section className="break shell">
      <p className="who">{t.breakSection.who}</p>
      <blockquote>{t.breakSection.quote}</blockquote>
      <p style={{ color: "var(--fg-dim)", maxWidth: "34ch" }}>{t.breakSection.note}</p>
    </section>
  );
}
