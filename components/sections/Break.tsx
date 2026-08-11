"use client";

import { useLocale } from "../LocaleProvider";
import { site } from "@/lib/site";

/**
 * A gap in the page where the furnace shows through. No panel, no card —
 * the billet from the WebGL layer is the content here.
 */
export function Break() {
  const { locale } = useLocale();

  return (
    <section className="break shell" data-heat="1">
      <p className="who">{locale === "bg" ? "Пещта" : "The furnace"}</p>
      <blockquote>
        {locale === "bg"
          ? `Алуминият се лее при ${site.castTempC} °C.`
          : `Aluminium casts at ${site.castTempC} °C.`}
      </blockquote>
      <p style={{ color: "var(--fg-dim)", maxWidth: "34ch" }}>
        {locale === "bg"
          ? "Оттам нататък всичко е контрол: химия, скорост на леене, охлаждане."
          : "From there on it is all control: chemistry, casting speed, cooling."}
      </p>
    </section>
  );
}
