"use client";

import { create } from "zustand";

export interface XpSnapshot {
  xp: number;
  level: number;
  streakDays: number;
  lastActivityAt?: number;
}

interface XpState extends XpSnapshot {
  addXp: (amount: number) => void;
  setSnapshot: (snap: XpSnapshot) => void;
}

const XP_STORAGE_KEY = "gamification:xp";

function loadSnapshot(): XpSnapshot {
  if (typeof window === "undefined") {
    return { xp: 0, level: 1, streakDays: 0 };
  }
  try {
    const raw = window.localStorage.getItem(XP_STORAGE_KEY);
    if (!raw) return { xp: 0, level: 1, streakDays: 0 };
    const parsed = JSON.parse(raw) as XpSnapshot;
    return { xp: 0, level: 1, streakDays: 0, ...parsed };
  } catch {
    return { xp: 0, level: 1, streakDays: 0 };
  }
}

function saveSnapshot(snap: XpSnapshot): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(XP_STORAGE_KEY, JSON.stringify(snap));
  } catch {
    // ignore
  }
}

export function xpNeededForLevel(level: number): number {
  // Quadratic growth curve tuned for business cadence
  return Math.floor(100 + (level - 1) * (level - 1) * 50);
}

export const useXpStore = create<XpState>((set, get) => ({
  ...loadSnapshot(),
  addXp: (amount: number) => {
    const current = get();
    let newXp = current.xp + amount;
    let newLevel = current.level;
    // Level up loop in case of large awards
    while (newXp >= xpNeededForLevel(newLevel)) {
      newXp -= xpNeededForLevel(newLevel);
      newLevel += 1;
    }
    const nextSnap: XpSnapshot = {
      xp: newXp,
      level: newLevel,
      streakDays: current.streakDays,
      lastActivityAt: Date.now(),
    };
    saveSnapshot(nextSnap);
    set(nextSnap);
  },
  setSnapshot: (snap: XpSnapshot) => {
    saveSnapshot(snap);
    set(snap);
  },
}));
