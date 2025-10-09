"use client";

export type FeatureFlag = "game_mode" | "ar_scan" | "premium_pass";

type FlagState = Record<FeatureFlag, boolean>;

const FLAG_STORAGE_KEY = "featureFlags";

const DEFAULT_FLAGS: FlagState = {
  game_mode: false,
  ar_scan: false,
  premium_pass: false,
};

const listeners = new Set<(state: FlagState) => void>();

function readFromStorage(): FlagState {
  if (typeof window === "undefined") return { ...DEFAULT_FLAGS };
  try {
    const raw = window.localStorage.getItem(FLAG_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_FLAGS };
    const parsed = JSON.parse(raw) as Partial<FlagState>;
    return { ...DEFAULT_FLAGS, ...parsed };
  } catch {
    return { ...DEFAULT_FLAGS };
  }
}

function writeToStorage(state: FlagState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(FLAG_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

let flags: FlagState = readFromStorage();

function notify(): void {
  for (const cb of listeners) cb({ ...flags });
}

export function getFlags(): FlagState {
  return { ...flags };
}

export function isFlagEnabled(flag: FeatureFlag): boolean {
  return !!flags[flag];
}

export function setFlag(flag: FeatureFlag, value: boolean): void {
  flags = { ...flags, [flag]: value };
  writeToStorage(flags);
  notify();
}

export function toggleGameMode(): boolean {
  const next = !flags.game_mode;
  setFlag("game_mode", next);
  return next;
}

export function subscribeFlags(cb: (state: FlagState) => void): () => void {
  listeners.add(cb);
  cb({ ...flags });
  return () => listeners.delete(cb);
}
