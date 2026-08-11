"use client";

/**
 * One number the whole page agrees on: how hot the metal is right now.
 * 0 = a cold, solid billet. 1 = the melt at casting temperature.
 * The scroll controller writes it; the WebGL scene and the CSS accent read it.
 */
type Listener = (heat: number) => void;

let heat = 0.55;
const listeners = new Set<Listener>();

export const getHeat = () => heat;

export function setHeat(next: number) {
  const v = Math.min(1, Math.max(0, next));
  if (Math.abs(v - heat) < 0.0005) return;
  heat = v;
  for (const l of listeners) l(v);
}

export function onHeat(l: Listener) {
  listeners.add(l);
  l(heat);
  return () => {
    listeners.delete(l);
  };
}

/** Ambient temperature to casting temperature, for the readouts. */
export const heatToCelsius = (h: number) => Math.round(20 + h * 720);
