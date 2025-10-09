"use client";

import { useEffect, useState } from "react";
import { isFlagEnabled, subscribeFlags } from "@/lib/gamification/flags";
import { useXpStore, xpNeededForLevel } from "@/lib/gamification/xp";

export default function HUD() {
  const [gameOn, setGameOn] = useState(false);
  const { level, xp } = useXpStore();

  useEffect(() => {
    setGameOn(isFlagEnabled("game_mode"));
    return subscribeFlags((s) => setGameOn(s.game_mode));
  }, []);

  if (!gameOn) return null;

  const needed = xpNeededForLevel(level);
  const pct = Math.min(100, Math.round((xp / needed) * 100));

  return (
    <div className="fixed left-0 right-0 top-0 z-50 px-3 py-2">
      <div className="mx-auto max-w-7xl rounded-xl bg-black/50 backdrop-blur border border-white/10 shadow-lg p-3">
        <div className="flex items-center gap-3 text-sm text-white">
          <div className="font-semibold">Lot Legends: PaveQuest</div>
          <div className="ml-auto flex items-center gap-3 w-full sm:w-1/2">
            <div className="shrink-0">Lv {level}</div>
            <div className="relative flex-1 h-2 rounded bg-white/20 overflow-hidden">
              <div className="absolute left-0 top-0 h-full bg-gradient-to-r from-amber-400 to-fuchsia-500" style={{ width: `${pct}%` }} />
            </div>
            <div className="shrink-0 tabular-nums">{xp}/{needed} XP</div>
          </div>
        </div>
      </div>
    </div>
  );
}
