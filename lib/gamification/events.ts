"use client";

import { awardXpForEvent } from "./rules";

export type GamificationEventType =
  | "estimate_created"
  | "job_completed"
  | "qa_passed"
  | "route_optimized"
  | "timesheet_submitted"
  | "client_signed"
  | "weather_mitigated"
  | "zero_rework_streak";

export interface GamificationEvent<T = unknown> {
  type: GamificationEventType;
  payload?: T;
  timestamp: number; // epoch ms
}

const listeners = new Set<(event: GamificationEvent) => void>();

export function emitEvent<T = unknown>(type: GamificationEventType, payload?: T): void {
  const event: GamificationEvent<T> = { type, payload, timestamp: Date.now() };
  for (const cb of listeners) cb(event);
  // process awards
  awardXpForEvent(event);
}

export function subscribeEvents(cb: (event: GamificationEvent) => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
