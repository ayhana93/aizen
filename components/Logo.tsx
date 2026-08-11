"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";

type Variant = "lockup" | "full" | "mark";

/**
 * The AIZEN METAL logo, cut out of the supplied artwork and lit like the metal
 * it is: the chrome tilts towards the pointer and a specular sweep runs across
 * the mark on hover, masked to the logo's own silhouette so the light stays on
 * the metal and never on the background.
 *
 * - `lockup` — mark beside the wordmark, for the header
 * - `full`   — the stacked original, for the footer
 * - `mark`   — the knot on its own
 */
export function Logo({
  variant = "lockup",
  height = 40,
  className = "",
}: {
  variant?: Variant;
  height?: number;
  className?: string;
}) {
  const root = useRef<HTMLAnchorElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [spin, setSpin] = useState(0);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const onMove = (e: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / 420;
        const dy = (e.clientY - (r.top + r.height / 2)) / 320;
        setTilt({
          x: Math.max(-1, Math.min(1, dx)),
          y: Math.max(-1, Math.min(1, dy)),
        });
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const markStyle = {
    transform: `perspective(700px) rotateY(${tilt.x * 16 + spin}deg) rotateX(${-tilt.y * 12}deg)`,
  } as React.CSSProperties;

  return (
    <a
      ref={root}
      className={`logo logo-${variant} ${className}`.trim()}
      href="#top"
      aria-label={site.name}
      onClick={() => setSpin((s) => s + 360)}
    >
      {variant === "full" ? (
        <span className="logo-plate" style={{ ...markStyle, height: height * 1.6 }}>
          <Sheen src="/media/logo-full.png" />
        </span>
      ) : (
        <>
          <span className="logo-plate logo-knot" style={{ ...markStyle, height }}>
            <Sheen src="/media/logo-mark.png" />
          </span>
          {variant === "lockup" ? (
            <span className="logo-plate logo-type" style={{ height: height * 0.44 }}>
              <Sheen src="/media/logo-word.png" />
            </span>
          ) : null}
        </>
      )}
    </a>
  );
}

/** The artwork plus a light sweep clipped to its own alpha. */
function Sheen({ src }: { src: string }) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" draggable={false} />
      <span
        className="logo-sheen"
        style={{
          WebkitMaskImage: `url(${src})`,
          maskImage: `url(${src})`,
        }}
      />
    </>
  );
}
