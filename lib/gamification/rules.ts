"use client";

import { GamificationEvent, GamificationEventType } from "./events";
import { useXpStore } from "./xp";

const XP_BY_EVENT: Record<GamificationEventType, number> = {
  estimate_created: 25,
  job_completed: 120,
  qa_passed: 60,
  route_optimized: 35,
  timesheet_submitted: 10,
  client_signed: 150,
  weather_mitigated: 40,
  zero_rework_streak: 80,
};

export function awardXpForEvent(event: GamificationEvent): void {
  const amount = XP_BY_EVENT[event.type] ?? 0;
  if (amount <= 0) return;
  // Access store lazily to avoid SSR issues
  try {
    useXpStore.getState().addXp(amount);
  } catch {
    // ignore client-only store on server
  }
}
