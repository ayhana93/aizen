"use client";

import { setHeat } from "./heat";

/**
 * The hero runs the plant's own sequence on a loop:
 * casting → the finished billet → bundling → the truck leaving the yard.
 *
 * `phase` is the stage index, `u` the progress inside it (0…1). Everything in
 * the scene is a function of those two numbers, so a click on a stage chip and
 * the autoplay clock drive exactly the same animation.
 */
export const STAGES = [0, 1, 2, 3] as const;
export type Phase = (typeof STAGES)[number];

/** Seconds each stage holds before handing over. */
const DURATION: Record<Phase, number> = { 0: 6.5, 1: 5, 2: 5.5, 3: 7 };

/** How hot the metal is in each stage, as 0…1 (1 = 720 °C). */
const STAGE_HEAT: Record<Phase, [number, number]> = {
  0: [0.98, 0.98],
  1: [0.97, 0.06],
  2: [0.05, 0.02],
  3: [0.01, 0.0],
};

type State = { phase: Phase; u: number };
type Listener = (s: State) => void;

let state: State = { phase: 0, u: 0 };
let paused = false;
let raf = 0;
let last = 0;
let started = false;

const listeners = new Set<Listener>();

function emit() {
  const [a, b] = STAGE_HEAT[state.phase];
  setHeat(a + (b - a) * smooth(state.u));
  for (const l of listeners) l(state);
}

const smooth = (t: number) => t * t * (3 - 2 * t);

function tick(now: number) {
  raf = requestAnimationFrame(tick);
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  if (paused) return;

  const span = DURATION[state.phase];
  let u = state.u + dt / span;
  let phase = state.phase;
  if (u >= 1) {
    u = 0;
    phase = (((phase + 1) % 4) as Phase);
  }
  state = { phase, u };
  emit();
}

export function startStageClock() {
  if (started) return () => {};
  started = true;
  last = performance.now();
  raf = requestAnimationFrame(tick);
  const onVisibility = () => {
    paused = document.hidden;
    last = performance.now();
  };
  document.addEventListener("visibilitychange", onVisibility);
  return () => {
    cancelAnimationFrame(raf);
    document.removeEventListener("visibilitychange", onVisibility);
    started = false;
  };
}

export function goToStage(phase: Phase) {
  state = { phase, u: 0 };
  last = performance.now();
  emit();
}

export function setPaused(v: boolean) {
  paused = v;
  last = performance.now();
}

export const getStage = () => state;

export function onStage(l: Listener) {
  listeners.add(l);
  l(state);
  return () => {
    listeners.delete(l);
  };
}

/**
 * Visibility weight of each stage, with a short crossfade at the hand-over so
 * one stage is dissolving as the next arrives.
 */
export function stageWeights({ phase, u }: State) {
  const w = [0, 0, 0, 0];
  const b = u < 0.84 ? 0 : smooth((u - 0.84) / 0.16);
  w[phase] = 1 - b;
  w[(phase + 1) % 4] = b;
  return w;
}
