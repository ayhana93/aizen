"use client";

import dynamic from "next/dynamic";

/** WebGL never runs on the server; the fallback gradient covers the gap. */
const Scene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => <div className="scene-fallback" aria-hidden />,
});

export function SceneMount() {
  return <Scene />;
}
