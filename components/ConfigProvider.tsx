"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { site } from "@/lib/site";

export type Config = {
  alloy: string;
  diameter: number;
  length: number;
};

type Ctx = Config & { set: (patch: Partial<Config>) => void };

const ConfigContext = createContext<Ctx | null>(null);

/** The billet the visitor configured, so the inquiry form opens pre-filled. */
export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [cfg, setCfg] = useState<Config>({
    alloy: site.alloys[1],
    diameter: site.diameters[1],
    length: site.lengths[5],
  });

  const value = useMemo<Ctx>(
    () => ({ ...cfg, set: (patch) => setCfg((c) => ({ ...c, ...patch })) }),
    [cfg],
  );

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>;
}

export function useConfig() {
  const ctx = useContext(ConfigContext);
  if (!ctx) throw new Error("useConfig must be used inside ConfigProvider");
  return ctx;
}

/** Billet mass in kg at 2.70 g/cm³. */
export function billetWeight(diameterMm: number, lengthMm: number) {
  const r = diameterMm / 20; // cm
  const l = lengthMm / 10; // cm
  return (Math.PI * r * r * l * 2.7) / 1000;
}
