"use client";

import Lenis from "lenis";
import { useEffect, useRef, useState } from "react";
import { heatToCelsius, onHeat, setHeat } from "@/lib/heat";

/**
 * Smooth scrolling plus the heat curve.
 *
 * Any element carrying data-heat="0.8" is an anchor on the curve. As the
 * viewport centre travels between two anchors the page temperature is
 * interpolated between their values, so the metal genuinely heats up going
 * into the furnace and cools down again on the way to dispatch.
 */
export function ScrollRig() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let lenis: Lenis | null = null;
    let raf = 0;

    type Anchor = { y: number; heat: number };
    let anchors: Anchor[] = [];

    const measure = () => {
      const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-heat]"));
      anchors = nodes
        .map((el) => {
          const rect = el.getBoundingClientRect();
          return {
            y: rect.top + window.scrollY + rect.height / 2,
            heat: parseFloat(el.dataset.heat ?? "0.5"),
          };
        })
        .sort((a, b) => a.y - b.y);
    };

    const applyHeat = () => {
      if (!anchors.length) return;
      const focus = window.scrollY + window.innerHeight / 2;
      if (focus <= anchors[0].y) return setHeat(anchors[0].heat);
      const last = anchors[anchors.length - 1];
      if (focus >= last.y) return setHeat(last.heat);
      for (let i = 0; i < anchors.length - 1; i++) {
        const a = anchors[i];
        const b = anchors[i + 1];
        if (focus >= a.y && focus <= b.y) {
          const t = (focus - a.y) / Math.max(1, b.y - a.y);
          const eased = t * t * (3 - 2 * t);
          return setHeat(a.heat + (b.heat - a.heat) * eased);
        }
      }
    };

    measure();
    applyHeat();

    if (!reduced) {
      lenis = new Lenis({ duration: 1.05, lerp: 0.09, wheelMultiplier: 0.9 });
      const loop = (time: number) => {
        lenis?.raf(time);
        applyHeat();
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);

      // in-page links go through Lenis so they land smoothly
      const onClick = (e: MouseEvent) => {
        const link = (e.target as HTMLElement | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
        if (!link) return;
        const id = link.getAttribute("href")!.slice(1);
        const target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        lenis?.scrollTo(target, { offset: -70 });
        history.replaceState(null, "", `#${id}`);
      };
      document.addEventListener("click", onClick);

      const ro = new ResizeObserver(() => {
        measure();
        applyHeat();
      });
      ro.observe(document.body);
      window.addEventListener("resize", measure);

      return () => {
        cancelAnimationFrame(raf);
        document.removeEventListener("click", onClick);
        window.removeEventListener("resize", measure);
        ro.disconnect();
        lenis?.destroy();
      };
    }

    const onScroll = () => applyHeat();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
    };
  }, []);

  // mirror the heat into CSS so the accent colour cools with the metal
  useEffect(() => onHeat((h) => {
    document.documentElement.style.setProperty("--heat", h.toFixed(3));
  }), []);

  return null;
}

/** Fixed temperature gauge — the page's thermometer. */
export function TemperatureRail() {
  const [c, setC] = useState(() => heatToCelsius(0.55));
  const raf = useRef(0);
  const pending = useRef(0);

  useEffect(() =>
    onHeat((h) => {
      pending.current = heatToCelsius(h);
      if (raf.current) return;
      raf.current = requestAnimationFrame(() => {
        raf.current = 0;
        setC(pending.current);
      });
    }), []);

  return (
    <div className="rail" aria-hidden>
      <span className="rail-temp">{c} °C</span>
      <span className="rail-track">
        <span className="rail-fill" />
      </span>
      <span className="mono-label" style={{ writingMode: "vertical-rl", letterSpacing: "0.2em" }}>
        temp
      </span>
    </div>
  );
}
