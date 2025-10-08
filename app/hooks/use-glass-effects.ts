
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GlassEffectSettings, DEFAULT_GLASS_SETTINGS } from '@/lib/glass-effects';

interface GlassEffectsStore {
  topbarSettings: GlassEffectSettings;
  sidebarSettings: GlassEffectSettings;
  setTopbarSettings: (settings: Partial<GlassEffectSettings>) => void;
  setSidebarSettings: (settings: Partial<GlassEffectSettings>) => void;
  resetToDefaults: () => void;
}

export const useGlassEffects = create<GlassEffectsStore>()(
  persist(
    (set) => ({
      topbarSettings: { ...DEFAULT_GLASS_SETTINGS },
      sidebarSettings: { ...DEFAULT_GLASS_SETTINGS },
      
      setTopbarSettings: (settings) =>
        set((state) => ({
          topbarSettings: { ...state.topbarSettings, ...settings },
        })),
      
      setSidebarSettings: (settings) =>
        set((state) => ({
          sidebarSettings: { ...state.sidebarSettings, ...settings },
        })),
      
      resetToDefaults: () =>
        set({
          topbarSettings: { ...DEFAULT_GLASS_SETTINGS },
          sidebarSettings: { ...DEFAULT_GLASS_SETTINGS },
        }),
    }),
    {
      name: 'glass-effects-storage',
    }
  )
);
