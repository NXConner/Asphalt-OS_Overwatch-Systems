"use client";

import { useEffect, useState } from "react";
import { Gamepad2, Sparkles } from "lucide-react";
import { isFlagEnabled, toggleGameMode, subscribeFlags } from "@/lib/gamification/flags";

export default function GameModeToggle() {
  const [enabled, setEnabled] = useState<boolean>(false);

  useEffect(() => {
    setEnabled(isFlagEnabled("game_mode"));
    return subscribeFlags((state) => setEnabled(state.game_mode));
  }, []);

  return (
    <button
      type="button"
      onClick={() => setEnabled(toggleGameMode())}
      title={enabled ? "Disable Game Mode" : "Enable Game Mode"}
      className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors border ${
        enabled
          ? "bg-gradient-to-r from-fuchsia-600 to-amber-500 text-white border-transparent shadow"
          : "bg-transparent text-foreground hover:bg-accent/10 border-border"
      }`}
    >
      {enabled ? <Sparkles className="h-4 w-4" /> : <Gamepad2 className="h-4 w-4" />}
      <span className="hidden sm:inline">{enabled ? "Game Mode" : "Play"}</span>
    </button>
  );
}
