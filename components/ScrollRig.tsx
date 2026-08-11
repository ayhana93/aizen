"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { onHeat } from "@/lib/heat";

/**
 * Smooth scrolling, and a mirror of the hero's temperature into CSS so the
 * page's ambient glow tracks the metal in the reel.
 */
export function ScrollRig() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const lenis = new Lenis({ duration: 1.05, lerp: 0.09, wheelMultiplier: 0.9 });
    let raf = requestAnimationFrame(function loop(time: number) {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    });

    // in-page links go through Lenis so they land smoothly
    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute("href")!.slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -70 });
      history.replaceState(null, "", `#${id}`);
    };
    document.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("click", onClick);
      lenis.destroy();
    };
  }, []);

  useEffect(
    () =>
      onHeat((h) => {
        document.documentElement.style.setProperty("--heat", h.toFixed(3));
      }),
    [],
  );

  return null;
}
