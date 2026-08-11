"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A photo slot. The plant photos live in /public/media; until a file is
 * dropped in, the slot degrades to a labelled placeholder instead of a
 * broken image, so the page is presentable either way.
 */
export function Plate({
  src,
  alt,
  caption,
  ratio = "3 / 2",
  hint,
}: {
  src: string;
  alt: string;
  caption?: string;
  ratio?: string;
  hint?: string;
}) {
  const [failed, setFailed] = useState(false);
  const img = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const el = img.current;
    if (el && el.complete && el.naturalWidth === 0) setFailed(true);
  }, []);

  return (
    <figure className="plate" style={{ ["--ratio" as string]: ratio, margin: 0 }}>
      {failed ? (
        <span className="plate-empty">
          <span>{hint ?? alt}</span>
          <span style={{ opacity: 0.6 }}>{src}</span>
        </span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={img}
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
        />
      )}
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
